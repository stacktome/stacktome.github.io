const proportions = [0.6170168023, 0.197526328, 0.0850788611, 0.0418037154, 0.0221393684,
    0.01263921, 0.0079834532, 0.005017955, 0.0034861582, 0.0023769261, 0.0016206314,
    0.001104976, 0.0007533927, 0.0005136768, 0.0003502342, 0.0002387961, 0.0001628155,
    0.0001110106, 0.000075689
];
const api_url = "https://us-central1-fuzzylabs-1314.cloudfunctions.net/get-report-request";
const slider_properties = {
    range: "min",
    value: 1,
    step: 50,
    min: 0,
    max: parseInt($('#toc').val()) || 500000,
    slide: function(event, ui) {
        var id = $(this).attr("id").split('-')[0];
        $("#" + id + "-time").val(ui.value);
    }
}
var aov, toc, lift, spCookie, userUrl = '',
    buyersArr = [];

function copy(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(getUrl()).select();
    document.execCommand("copy");
    var x = document.getElementById("snackbar")
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
    $temp.remove();
}

function getUrl() {
    var url = "https://retentionmarketingcalculator.com";
    var userInputs = {
        aov: aov || null,
        toc: toc || null,
        lift: lift || null,
        buyersArr: buyersArr || [],
    }
    if (buyersArr.length > 0 && aov && toc && lift) {
        userUrl = "?data=" + btoa(JSON.stringify(userInputs));
        url += userUrl;
    }
    if (spCookie) {
        if (buyersArr) url += '&';
        else url += '?';
        url += "ref=" + spCookie;
    }
    return url;
}

function getCookie() {
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.startsWith('_sp_id')) {
            return c.split('=')[0].split('.')[1];
        }
    }
    return "";
}

$(function() {
    if (window.snowplow) {
        window.snowplow(function() {
            var cf = this.cf;
            spCookie = cf.getCookieName('id');
        });
    }
    if (!spCookie) spCookie = getCookie();
    Chart.defaults.global.maintainAspectRatio = false;
    // Get query data
    location.queryString = {};
    location.search.substr(1).split("&").forEach(function(pair) {
        if (pair === "") return;
        var parts = pair.split("=");
        location.queryString[parts[0]] = parts[1] &&
            decodeURIComponent(parts[1].replace(/\+/g, " "));

    });
    if (Object.keys(location.queryString).length > 0) {
        if (location.queryString.data) {
            var data = JSON.parse(atob(location.queryString.data));
            if (data.aov) {
                $("#aov").val(data.aov);
                aov = data.aov;
            }
            if (data.toc) {
                $("#toc").val(data.toc);
                toc = data.toc;
            }
            if (data.lift) {
                $("#lift").val(data.lift);
                lift = data.lift;
            }
            if (data.buyersArr.length > 0) {
                buyersArr = data.buyersArr;
                for (var i = 0; i < data.buyersArr.length; i++) {
                    let x = data.buyersArr[i].pf;
                    let value = data.buyersArr[i].buyers;
                    if (!$("#" + x + "-time").length) {
                        append(x);
                    } else {
                        $("#" + x + "-time-slider").slider(slider_properties);
                        $("#" + x + "-time").change(function() {
                            var value = this.value.substring(1);
                            $("#1-time-slider").slider("value", parseInt(value));
                        });
                    }
                    $("#" + x + "-time").val(value);
                    $("#" + x + "-time-slider").slider("value", parseInt(value));

                }
                if (data.buyersArr.length === 11) $('#add-more').hide();
            }
            calculate();
        }
    }

    $("#1-time-slider").slider(slider_properties);
    $("#1-time").change(function() {
        var value = this.value.substring(1);
        $("#1-time-slider").slider("value", parseInt(value));
    });

    $("#2-time-slider").slider(slider_properties);
    $("#2-time").change(function() {
        var value = this.value.substring(1);
        $("#2-time-slider").slider("value", parseInt(value));
    });

    $("#3-time-slider").slider(slider_properties);
    $("#3-time").change(function() {
        var value = this.value.substring(1);
        $("#3-time-slider").slider("value", parseInt(value));
    });

    $('[data-toggle="popover"]').popover();

    $('#edit').click(function(event) {
        if ($('#user-inputs').css('display') === 'none') {
            $('#user-inputs').slideToggle();
            var element = document.getElementById("user-inputs");
            element.scrollIntoView();
        } else {
            $('#user-inputs').slideToggle();
        }
    });

    $('#fullReport').on('shown.bs.modal', function() {
        $('#sendname').trigger('focus');
        window.snowplow('trackStructEvent', 'calculator', 'get-full-report', '', '', 20);
    });

    $('#send-report-form').submit(function(event) {
        event.preventDefault();
        window.snowplow('trackStructEvent', 'calculator', 'send-full-report', '', '', 20);
        $('#fullReport button').prop('disabled', true);
        let info = $(this).serializeArray();
        let user_info = {};
        for (var i = 0; i < info.length; i++) {
            user_info[info[i].name] = info[i].value;
        }
        user_info['aov'] = aov;
        user_info['toc'] = toc;
        user_info['lift'] = lift;
        user_info['buyers'] = buyersArr;
        // get access to google cloud api 
        $(this).append("<i class='fa fa-spin fa-spinner'></i>");
        var request = $.ajax({
            url: api_url,
            method: "POST",
            data: JSON.stringify({ data: user_info }),
            contentType: 'application/json'
        });
        request.done(function(msg) {
            $('#fullReport .fa-spin').remove();
            $('#fullReport').modal('hide');
            window.location.href = "thankyou.html" + userUrl;
            //$('#submitReport').modal('show');
        });
        request.fail(function(jqXHR, textStatus) {
            var error = jqXHR.responseJSON.error || 'Error while sending your request. Try again or contact us.';
            $('#fullReport button').prop('disabled', false);
            $('#fullReport .fa-spin').remove();
            alert(error);
        });

    });

    function calculate() {
        let revenueArr = [],
            rppArr = [],
            extraArr = [];

        $('#user-inputs').slideToggle();
        $('#loading').show();
        progress(0);

        let onetime = Math.round(toc * 0.59);
        if (buyersArr.length != 11) {
            var value;
            for (var i = buyersArr.length - 1; i < 10; i++) {
                let x = i + 2;
                value = Math.round(((toc - buyersArr[0].buyers) * proportions[i]) / x);
                if (i == 9) {
                    value = countLast();
                }
                buyersArr.push({ pf: x, buyers: value });
            }
        }

        $('.liftval').html(lift);

        for (var j = 0; j < buyersArr.length; j++) {
            // First chart
            revenueArr.push(aov * buyersArr[j].pf * buyersArr[j].buyers);
            // Second chart
            let summ1 = buyersArr.slice(j, buyersArr.length);
            summ1 = summ1.reduce(function(memo, num) {
                return memo + num.buyers;
            }, 0);
            let summ2 = buyersArr.slice(j + 1, buyersArr.length);
            summ2 = summ2.reduce(function(memo, num) {
                return memo + num.buyers;
            }, 0);
            rppArr.push(Math.round((summ2 / summ1) * 100));
        }

        let arr = revenueArr.slice(1, revenueArr.length);
        let sum = arr.reduce(function(total, num) {
            return total + num;
        }, 0);
        arr = buyersArr.slice(1, buyersArr.length);
        let sumByuer = arr.reduce(function(total, num) {
            return total + num.buyers;
        }, 0);

        // First chart and values
        createChart("rpf", revenueArr);
        $('#revTotal').html(Math.round((sumByuer / sum) * aov * 100) + "%");
        $('#avgClv').html("$ " + aov);
        $('#repClv').html("$ " + Math.round(sum / sumByuer));

        // Second chart
        createChart("rpp", rppArr);
        $('#likelyhood').html(Math.round((rppArr[1] / rppArr[0]) * 100) + " % ");

        // Third chart
        //count extra revenue
        var rpp_products = [];
        var rpp_proportions = [];
        for (let i = 1; i < rppArr.length; i++) {
            var array = rppArr.slice(1, i + 1);
            if (i === rppArr.length - 1) {
                array = rppArr.slice(1, (rppArr.length - 1));
            }
            rpp_products.push(array.reduce(function(a, b) { return (a * b) / 100; }));
        }
        var sum_products = rpp_products.reduce(function(total, num) {
            return total + num;
        }, 0);
        for (let i = 0; i < rpp_products.length; i++) {
            rpp_proportions.push(rpp_products[i] / sum_products);
        }

        var extra_count = Math.round(buyersArr[0].buyers * (rppArr[0] / 100) * (lift / 100));
        var extra_buyers = 0;
        for (var i = 1; i < buyersArr.length; i++) {
            var buyers = extra_count * rpp_proportions[i - 1];
            extra_buyers += buyers;
            extraArr.push(Math.round(buyers * aov * i));
        }
        var extra_rev = extraArr.reduce(function(total, num) {
            return total + num;
        }, 0);
        createChart("pff", extraArr);
        $('#extraRev').html("$ " + extra_rev);
        $('#extraAvg').html("$ " + Math.round(extra_rev / extra_buyers));
        $('#extraRepeat').html(extra_count);
        setTimeout(progress(100), 10000);

        var link = document.getElementById("emailshare");
        link.setAttribute("href", "mailto:?subject=I wanted you to see this site&body=Check out this site " + getUrl());
        $("#share").jsSocials({
            url: getUrl(),
            shareIn: "popup",
            showLabel: false,
            showCount: false,
            shares: [{ share: "twitter", logo: "fab fa-twitter" },
                { share: "facebook", logo: "fab fa-facebook-f" },
                { share: "linkedin", logo: "fab fa-linkedin-in" }
            ],
            on: {
                click: function(e) {
                    window.snowplow('trackStructEvent', 'calculator', 'share-' + this.share, '', '', 20);
                }
            }
        });
        $('#result').show();
        $('#loading').hide();
    }

    $('#calculate-form').submit(function(event) {
        event.preventDefault();
        let resultArr = $(this).serializeArray();
        buyersArr = [];
        for (let i = 0; i < resultArr.length; i++) {
            var name = resultArr[i].name;
            if (name === 'aov') { aov = parseInt(resultArr[i].value); }
            if (name === 'toc') { toc = parseInt(resultArr[i].value); }
            if (name === 'lift') { lift = parseInt(resultArr[i].value); }
            if (name.split('-').length > 1) {
                buyersArr.push({ pf: parseInt(name.split('-')[0]), buyers: parseInt(resultArr[i].value) });
            }
        }
        window.snowplow('trackStructEvent', 'calculator', 'calculate', '', '', 20);
        calculate();
    });

    $('#add-more').click(function(event) {
        let count = ($('#buyers').children('.form-group').length + 1);
        let toc = parseInt($('#toc').val());
        let onetime = Math.round(toc * 0.59);
        if (count <= 10) {
            append(count);
            if (toc && typeof toc === 'number') {
                let value = Math.round(((toc - onetime) * proportions[count - 2]) / count);
                $("#" + count + "-time").val(value);
                $("#" + count + "-time-slider").slider("value", parseInt(value));
            }
        } else if (count === 11) {
            append(count);
            let summ = countLast();
            if (summ !== 0) {
                $("#" + (count++) + "-time").val(summ);
                $("#11-time-slider").slider("value", parseInt(summ));
            }
            $('#add-more').hide();
        }
    });

    $('#toc').on('input', function() {
        let toc = parseInt($(this).val());
        if (toc && typeof toc === 'number') {
            updateSliders(toc);
            $(this).removeClass('is-invalid');
            let count = $('#buyers').children().length;
            let onetime = Math.round(toc * 0.59);
            $("#1-time").val(onetime);
            $("#1-time-slider").slider("value", parseInt(onetime));
            for (let i = 0; i < count; i++) {
                let x = i + 2;
                let value = Math.round(((toc - onetime) * proportions[i]) / x);
                $("#" + x + "-time").val(value);
                $("#" + x + "-time-slider").slider("value", parseInt(value));
            }
            if (count === 11) {
                let value = countLast();
                $("#11-time").val(value);
                $("#11-time-slider").slider("value", parseInt(value));
            }
        } else {
            $(this).addClass('is-invalid');
        }
    });

    function updateSliders(maxValue) {
        $("div[id$='-time-slider']").slider("option", "max", maxValue);
    }

    function createChart(chart, revenueArr) {
        var labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", ">10"];
        var label = chart === "rpp" ? "Revenue, %" : "Revenue, $";
        if (chart === 'rpp') {
            labels = labels.slice(0, labels.length - 1);
            label = "Next purchase conversion rate, %";
        }
        if (chart === 'pff') {
            labels = labels.slice(1, labels.length);
        }
        $("#" + chart).remove();
        $('.' + chart).append('<canvas id="' + chart + '"><canvas>');
        var canvas = document.getElementById(chart);
        var ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 400;
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: revenueArr,
                    backgroundColor: 'rgba(12, 89, 207, 0.7)',
                    hoverBackgroundColor: 'rgba(12, 89, 207, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                if (chart !== 'rpp') {
                                    return '$ ' + value;
                                } else {
                                    return '% ' + value;
                                }
                            }
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Purchase frequency'
                        }
                    }]
                }
            }
        });
    }

    function append(count) {
        $('#buyers').append(`<div class="form-group">
                <label for="${count}-time"><i class="fas fa-users"></i>
               ${count===11? ' > '+ (count-1): count} time buyers:</label>
                <input type="number" id="${count}-time" name="${count}-time"
                class="form-control mx-sm-3" required></div>
                <div id="${count}-time-slider"></div>`);
        $("#" + count + "-time-slider").slider(slider_properties);
        $("#" + count + "-time").change(function() {
            var value = this.value.substring(1);
            $("#" + count + "-time-slider").slider("value", parseInt(value));
        });

    }

    function progress(value) {
        var $div = $('.progress-bar');
        $div.attr('aria-valuenow', value);
        $div.css('width', value + '%');
    }

    function countLast() {
        let summ = 0;
        let toc = parseInt($('#toc').val());
        let onetime = Math.round(toc * 0.59);
        if (toc && typeof toc === 'number') {
            for (var i = 9; i < proportions.length; i++) {
                let value = Math.round(((toc - onetime) * proportions[i]) / (i + 2));
                summ += value;
            }
        }
        return summ;
    }

});

// contexts.push({
//     schema: "iglu:com.fuzzylabs/user_action/jsonschema/1-0-0",
//     data: {
//         action: el.action,
//         type: el.trackType,
//         url: window.location.pathname
//         element: el.htmlType,
//         elementId: el.id,
//         text: el.text
//     }
// })
// window.snowplow('trackStructEvent', 'user', 'action', '', '', '', contexts)