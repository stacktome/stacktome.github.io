!function() {
	'use strict'
	
	// Main initialization function
	!async function() {
		const script = document.currentScript;
		
		if (script) {
			// Parse filter parameters from script attributes
			const params = function(script) {
				const params = script.getAttribute('filter-params');
				try {
					return JSON.parse(params);
				} catch (error) {
					console.error('Error parsing filter params:', error);
					return null;
				}
			}(script);

			if (params) {
				let requestBody = null;
				let response = null;
				
				try {
					// Find the placeholder element
					const placeholder = document.getElementById('stacktome-widget-' + params.widgetId);
					if (!placeholder) return;

					// Show loading indicator
					const loadingIndicator = placeholder.querySelector('.loading-indicator');
					if (loadingIndicator) {
						loadingIndicator.style.display = 'flex';
					}

					// Initialize Snowplow if not already initialized
					if(!window.stSnowplow && params.trackingApiKey && params.domain && params.appId){
						var o = XMLHttpRequest.prototype.open;
						XMLHttpRequest.prototype.open = function(){
							var res = o.apply(this, arguments);
							var err = new Error();  
							if((arguments[1] || '').indexOf('stacktome') > 0)
								this.setRequestHeader('apikey', params.trackingApiKey);
							return res;
						}
							
						;(function () {
							;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
							p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
							};p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
							n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@3.17.0/dist/sp.js","stSnowplow")); 
						//TODO change to staging check
							window.stSnowplow('newTracker', 'cf3','https://services.stacktome.com/clickstream/collector',
							{ // Initialise a tracker
								appId: params.appId ,
								platform: 'web',
								cookieDomain: params.domain,
								sessionCookieTimeout: 3600, // one hour
								post: true,
								contexts: {
									performanceTiming: true,
									webPage: true
								},
								crossDomain: true,
								withCredentials: true
							});
						}());
					}

					// Prepare request body with payload
					requestBody = {
						...params.widgetPayload,
						widgetId: params.widgetId
					};

					// Fetch pre-rendered HTML
					response = await fetch(
						`https://services${params.staging ? '-staging' : ''}.stacktome.com/api/recommendations/v1/templates/${params.widgetId}/recommendations?apikey=${params.apiKey}`,
						{
							body: JSON.stringify(requestBody),
							method: 'POST',
							headers: { 'Content-Type': 'application/json' }
						}
					);

					// Check if the response is ok
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`API Error (${response.status}): ${errorText}`);
					}

					// Get the response data
					const data = await response.json();

					// Hide loading indicator after data is loaded
					if (loadingIndicator) {
						loadingIndicator.style.display = 'none';
					}

					if (placeholder) {
						if (data && data.data) {
							// Create a temporary div to decode HTML entities
							const temp = document.createElement('div');
							// Unescape the HTML content
							const unescapedHtml = data.data
								.replace(/\\r\\n/g, '\n')
								.replace(/\\n/g, '\n')
								.replace(/\\"/g, '"')
								.replace(/\\t/g, '\t')
								.replace(/\\\\/g, '\\');
							temp.innerHTML = unescapedHtml;
							
							// Insert the HTML content
							placeholder.innerHTML = temp.innerHTML;
							
							// Execute any scripts in the inserted content
							const scripts = placeholder.getElementsByTagName('script');
							const scriptPromises = Array.from(scripts).map(oldScript => {
								return new Promise((resolve, reject) => {
									const newScript = document.createElement('script');
									Array.from(oldScript.attributes).forEach(attr => {
										newScript.setAttribute(attr.name, attr.value);
									});
									
									if (oldScript.src) {
										// Handle external scripts
										newScript.onload = resolve;
										newScript.onerror = reject;
									} else {
										// Handle inline scripts
										newScript.textContent = oldScript.textContent;
										resolve();
									}
									
									oldScript.parentNode.replaceChild(newScript, oldScript);
								});
							});

							// Wait for all scripts to load before initializing widget
							Promise.all(scriptPromises)
								.then(() => {
									// Initialize widget functionality after scripts are loaded
									initializeWidget(placeholder, data.data);
								})
								.catch(error => {
									console.error('Error loading scripts:', error);
									// Still try to initialize widget even if some scripts fail
									initializeWidget(placeholder, data.data);
								});
						} else {
							placeholder.innerHTML = '<div style="color: red;">No content received from the service</div>';
							console.error('No content received from the service');
						}
					} else {
						console.error('No placeholder element found with id: stacktome-widget-' + params.widgetId);
					}
				} catch (error) {
					console.error('Error fetching widget data:', error);
					// Display error in the placeholder if it exists
					const placeholder = document.getElementById('stacktome-widget-' + params.widgetId);
					if (placeholder && params.staging) {
						placeholder.innerHTML = `<div style="color: red;">Error loading widget: ${error.message}</div>`;
					}

					if(!params.staging && window.stSnowplow){
						window.stSnowplow('trackSelfDescribingEvent', {
							event: {
								schema: 'iglu:com.stacktome/app_error/jsonschema/1-0-0',
								data: {
									"type": "widget_load_error",
									"url": window.location.href,
									"apiUrl": `https://services${params.staging ? '-staging' : ''}.stacktome.com/api/recommendations/v1/templates/${params.widgetId}/recommendations?apikey=${params.apiKey}`,
									"element": "offer-widget-div",
									"elementId": params.widgetId,
									"message": error.message,
									"stacktrace": error.stack,
									"request": requestBody ? JSON.stringify(requestBody) : 'undefined',
									"response": response ? JSON.stringify(response) : 'undefined',
								}
							}
						});
					}

					
				}
			}
		}
	}();

	// Widget functionality
	function initializeWidget(container, data) {
		const track = container.querySelector('.carousel-track');
		const slides = container.querySelectorAll('.carousel-slide img');
		const nextButton = container.querySelector('.carousel-button.next');
		const prevButton = container.querySelector('.carousel-button.prev');
		const dots = container.querySelectorAll('.dot');
		const nextOfferButton = container.querySelector('#new-offer-btn');

		let currentIndex = 0;
		let productIndex = 0;
		let selectedVariantIndex = -1; // Track selected variant, -1 means no selection

		// Parse offers data
		const offersData = container.querySelector('#offers-data');
		const offers = offersData ? JSON.parse(offersData.value) : [];

		// Define widget-scoped functions
		const trackOfferAction = function(type) {
			if(window.stSnowplow){
				const offerId = container.querySelector('.checkout-btn').dataset.offerId;
				const currentOffer = offers.find(offer => offer.offerId === offerId);
				if (!currentOffer) return;
				
				// Calculate minutes until expiration
				const now = new Date();
				const expireDate = new Date(currentOffer.expireAt);
				const minutesUntilExpiration = expireDate && expireDate > now ? Math.floor((expireDate - now) / (1000 * 60)) : 0;

				window.stSnowplow('trackSelfDescribingEvent', {
					event: {
						schema: 'iglu:com.stacktome/offer_action/jsonschema/1-0-0',
						data: {
							type: type,
							productSku: currentOffer.productSku,
							productRating: currentOffer.rating,
							productReviewCount: currentOffer.reviewCount,
							productPrice: currentOffer.productPrice,
							customerKey: currentOffer.customerKey,
							couponCode: currentOffer.couponCode,
							offerId: offerId,
							offerName: currentOffer.offerName,
							offerType: currentOffer.offerType,
							offerValue: currentOffer.offerValue,
							offerUrl: currentOffer.offerUrl,
							offerExpiration: minutesUntilExpiration
						}
					}
				});
			}
		};

		const redirectToOffer = function() {
			const currentOffer = offers[productIndex];
			
			// Check if variants exist and none is selected
			if (currentOffer.productVariations && currentOffer.productVariations.length > 0 && selectedVariantIndex === -1) {
				// Highlight the dropdown to indicate selection is required
				const variantDropdown = container.querySelector('.variant-dropdown');
				if (variantDropdown) {
					variantDropdown.style.borderColor = '#e74c3c';
					variantDropdown.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.5)';
					variantDropdown.focus();
					
					// Remove highlight after 3 seconds
					setTimeout(() => {
						variantDropdown.style.borderColor = '#ddd';
						variantDropdown.style.boxShadow = 'none';
					}, 3000);
				}
				return; // Don't proceed with redirect
			}
			
			let offerUrl = currentOffer.offerUrl;
			
			// Replace SKU in URL if variants exist and a variant is selected
			if (currentOffer.productVariations && currentOffer.productVariations.length > 0 && selectedVariantIndex >= 0) {
				const selectedVariant = currentOffer.productVariations[selectedVariantIndex];
				if (selectedVariant && selectedVariant.sku) {
					// Replace the base SKU with variant SKU in the URL
					offerUrl = offerUrl.replace(currentOffer.productSku, selectedVariant.sku);
				}
			}
			
			if (offerUrl) {
				window.location.href = offerUrl;
			}
		};

		// Update onclick handlers to use scoped functions
		const checkoutBtn = container.querySelector('.checkout-btn');
		if (checkoutBtn) {
			checkoutBtn.onclick = function(e) {
				e.preventDefault();
				trackOfferAction('checkout');
				redirectToOffer();
			};
		}

		const moreInfoLink = container.querySelector('.more-info-link');
		if (moreInfoLink) {
			moreInfoLink.onclick = function(e) {
				trackOfferAction('more_info');
			};
		}

		function trackOfferImpression(currentOffer){
			if(window.stSnowplow){
				// Calculate minutes until expiration
				const now = new Date();
				const expireDate = new Date(currentOffer.expireAt);
				const minutesUntilExpiration = expireDate && expireDate > now ? Math.floor((expireDate - now) / (1000 * 60)) : 0;

				window.stSnowplow('trackSelfDescribingEvent', {
					event: {
						schema: 'iglu:com.stacktome/offer_impression/jsonschema/1-0-0',
						data: {
							productSku: currentOffer.productSku,
							productRating: currentOffer.rating,
							productReviewCount: currentOffer.reviewCount,
							productPrice: currentOffer.productPrice,
							customerKey: currentOffer.customerKey,
							offerId: currentOffer.offerId,
							offerName: currentOffer.offerName,
							offerType: currentOffer.offerType,
							offerValue: currentOffer.offerValue,
							offerExpiration: minutesUntilExpiration
						}
					}
				});
			}
		}
		
		function updateProduct() {
			const currentOffer = offers[productIndex];

			trackOfferImpression(currentOffer);

			// Show loading indicator for images
			const imageLoadingIndicator = container.querySelector('.loading-indicator');
			if (imageLoadingIndicator) {
				imageLoadingIndicator.style.display = 'flex';
			}

			// Update carousel images with loading handling
			let imagesLoaded = 0;
			const totalImages = slides.length;
			
			slides.forEach((slide, i) => {
				const newSrc = currentOffer.productImages[i] || currentOffer.productImages[0];
				
				// Create a new image to preload
				const img = new Image();
				img.onload = function() {
					slide.src = newSrc;
					slide.alt = `Product Image ${i + 1}`;
					imagesLoaded++;
					
					// Hide loading indicator when all images are loaded
					if (imagesLoaded === totalImages && imageLoadingIndicator) {
						imageLoadingIndicator.style.display = 'none';
					}
				};
				img.onerror = function() {
					// Still update the slide even if image fails to load
					slide.src = newSrc;
					slide.alt = `Product Image ${i + 1}`;
					imagesLoaded++;
					
					if (imagesLoaded === totalImages && imageLoadingIndicator) {
						imageLoadingIndicator.style.display = 'none';
					}
				};
				img.src = newSrc;
			});

			// Update product details
			container.querySelector('.product-name').textContent = currentOffer.productName;
			container.querySelector('.more-info-link').href = currentOffer.productUrl || '#';
			container.querySelector('.more-info-link').dataset.offerId = currentOffer.offerId;
			container.querySelector('.checkout-btn').dataset.offerId = currentOffer.offerId;
			container.querySelector('.checkout-btn').dataset.offerUrl = currentOffer.offerUrl;
			
			// Handle product variants
			const variantsContainer = container.querySelector('.product-variants-container');
			const variantDropdown = container.querySelector('.variant-dropdown');
			
			if (currentOffer.productVariations && currentOffer.productVariations.length > 0) {
				// Show variants container
				variantsContainer.style.display = 'block';
				
				// Clear existing options
				variantDropdown.innerHTML = '';
				
				// Add placeholder option
				const placeholderOption = document.createElement('option');
				placeholderOption.value = '';
				placeholderOption.textContent = 'Please select an option';
				placeholderOption.disabled = true;
				placeholderOption.selected = true;
				variantDropdown.appendChild(placeholderOption);
				
				// Populate dropdown with variants
				currentOffer.productVariations.forEach((variant, index) => {
					const option = document.createElement('option');
					option.value = index;
					option.textContent = `${variant.name} - ${currentOffer.productPriceCurrencySymbol}${variant.price.toFixed(2)}`;
					variantDropdown.appendChild(option);
				});
				
				// Reset selected variant index for new product
				if (selectedVariantIndex >= currentOffer.productVariations.length) {
					selectedVariantIndex = -1;
				}
				
				// Set dropdown value based on selectedVariantIndex
				variantDropdown.value = selectedVariantIndex >= 0 ? selectedVariantIndex : '';
				
				// Add event listener for variant selection
				variantDropdown.onchange = function() {
					selectedVariantIndex = this.value === '' ? -1 : parseInt(this.value);
					updatePriceDisplay();
					updateBuyButtonState();
				};
			} else {
				// Hide variants container if no variations
				variantsContainer.style.display = 'none';
				selectedVariantIndex = -1; // Reset to no selection for products without variants
			}
			
			// Function to update buy button state
			function updateBuyButtonState() {
				const checkoutBtn = container.querySelector('.checkout-btn');
				const currentOffer = offers[productIndex];
				
				// If product has variants but none selected, disable button
				if (currentOffer.productVariations && currentOffer.productVariations.length > 0 && selectedVariantIndex === -1) {
					checkoutBtn.style.opacity = '0.6';
					checkoutBtn.style.cursor = 'not-allowed';
					checkoutBtn.textContent = 'Select option to buy';
				} else {
					checkoutBtn.style.opacity = '1';
					checkoutBtn.style.cursor = 'pointer';
					checkoutBtn.textContent = 'Buy now';
				}
			}
			
			// Function to update price display based on selected variant
			function updatePriceDisplay() {
				const currentOffer = offers[productIndex];
				let basePrice = parseFloat(currentOffer.productPrice);
				
				// Use variant price if variants exist and one is selected
				if (currentOffer.productVariations && currentOffer.productVariations.length > 0 && selectedVariantIndex >= 0) {
					const selectedVariant = currentOffer.productVariations[selectedVariantIndex];
					if (selectedVariant) {
						basePrice = parseFloat(selectedVariant.price);
					}
				}
				
				const currencySymbol = currentOffer.productPriceCurrencySymbol;
				let finalPrice = basePrice;
				let discountBadge = '';

				switch(currentOffer.offerType) {
					case 'discountPercent':
						finalPrice = basePrice * (1 - currentOffer.offerValue / 100);
						discountBadge = `-${currentOffer.offerValue}%`;
						break;
					case 'discountFixed':
						finalPrice = basePrice - currentOffer.offerValue;
						discountBadge = `-${currencySymbol}${currentOffer.offerValue}`;
						break;
					case 'discountCredit':
						finalPrice = basePrice;
						discountBadge = `+${currencySymbol}${currentOffer.offerValue}`;
						break;
					case 'freeProduct':
						finalPrice = 0;
						discountBadge = 'FREE';
						break;
				}

				// Update price display
				container.querySelector('.current-price').textContent = `${currencySymbol}${finalPrice.toFixed(2)}`;
				container.querySelector('.original-price').textContent = `${currencySymbol}${basePrice.toFixed(2)}`;
				
				// Only show strikethrough price for percent, fixed discounts, and free products
				const shouldShowOriginalPrice = currentOffer.offerType === 'discountPercent' || 
											currentOffer.offerType === 'discountFixed' || 
											currentOffer.offerType === 'freeProduct';
				container.querySelector('.original-price').style.display = shouldShowOriginalPrice ? 'inline' : 'none';

				// Update discount badge
				const discountElem = container.querySelector('.discount-badge');
				if (discountElem) {
					discountElem.textContent = discountBadge;
					discountElem.className = `discount-badge ${currentOffer.offerType}`;
				}

				// Add credit info if applicable
				const priceContainer = container.querySelector('.product-price');
				const existingCreditInfo = priceContainer.querySelector('.credit-info');
				if (existingCreditInfo) {
					existingCreditInfo.remove();
				}
				
				if (currentOffer.offerType === 'discountCredit') {
					const creditInfo = document.createElement('span');
					creditInfo.className = 'credit-info';
					creditInfo.textContent = `Earn ${currencySymbol}${currentOffer.offerValue} in credits`;
					priceContainer.appendChild(creditInfo);
				}
			}
			
			// Initial price update and button state
			updatePriceDisplay();
			updateBuyButtonState();

			// Update description with truncation
			const description = currentOffer.productDescription;
			const descriptionElem = container.querySelector('.product-description');
			const showMoreBtn = container.querySelector('.show-more-btn');
			
			descriptionElem.textContent = description;
			descriptionElem.classList.add('truncated');
			
			if (description.length > 66) {
				showMoreBtn.style.display = 'block';
				showMoreBtn.textContent = 'Show More';
				showMoreBtn.onclick = function() {
					if (descriptionElem.classList.contains('truncated')) {
						descriptionElem.classList.remove('truncated');
						showMoreBtn.textContent = 'Show Less';
					} else {
						descriptionElem.classList.add('truncated');
						showMoreBtn.textContent = 'Show More';
					}
				};
			} else {
				showMoreBtn.style.display = 'none';
			}

			// Update rating and reviews
			const ratingContainer = container.querySelector('.product-rating');
			const filledStars = container.querySelector('.filled-stars');
			const ratingCount = container.querySelector('.rating-count');
			
			if (currentOffer.rating && currentOffer.reviewCount && filledStars && ratingCount) {
				// Show rating container and update values
				if (ratingContainer) {
					ratingContainer.style.display = 'block';
				}
				filledStars.style.width = `${currentOffer.rating * 20}%`;
				ratingCount.textContent = `${currentOffer.reviewCount} reviews`;
			} else {
				// Hide rating container when rating or reviewCount is missing
				if (ratingContainer) {
					ratingContainer.style.display = 'none';
				}
			}

			// Update expiration date if exists
			const expirationElem = container.querySelector('.expiration-badge');
			if (currentOffer.expireAt && expirationElem) {
				const now = new Date();
				const expireDate = new Date(currentOffer.expireAt);
				
				// Don't show if already expired
				if (expireDate <= now) {
					expirationElem.style.display = 'none';
					return;
				}

				// Calculate time differences
				const diffMs = expireDate - now;
				const diffMinutes = Math.floor(diffMs / (1000 * 60));
				const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
				const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
				const remainingHours = diffHours % 24;
				const remainingMinutes = diffMinutes % 60;

				let formattedText;
				if (diffMinutes < 60) {
					formattedText = `Ends in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
				} else if (diffHours < 24) {
					formattedText = `Ends in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
					if (remainingMinutes > 0) {
						formattedText += ` and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
					}
				} else {
					formattedText = `Ends in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
					if (remainingHours > 0) {
						formattedText += ` and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
					}
				}

				expirationElem.textContent = formattedText;
				expirationElem.style.display = 'block';
			} else if (expirationElem) {
				expirationElem.style.display = 'none';
			}

			updateCarousel();
		}

		function updateCarousel() {
			track.style.transform = `translateX(-${currentIndex * 100}%)`;

			// Update active dot
			dots.forEach((dot, index) => {
				if (index === currentIndex) {
					dot.classList.add('active');
				} else {
					dot.classList.remove('active');
				}
			});
		}

		// Initial setup
		updateProduct();

		// Event listeners
		nextButton.addEventListener('click', () => {
			currentIndex = (currentIndex + 1) % slides.length;
			updateCarousel();
		});
		
		prevButton.addEventListener('click', () => {
			currentIndex = (currentIndex - 1 + slides.length) % slides.length;
			updateCarousel();
		});

		dots.forEach(dot => {
			dot.addEventListener('click', () => {
				currentIndex = parseInt(dot.getAttribute('data-index'));
				updateCarousel();
			});
		});

		nextOfferButton.addEventListener('click', () => {
			productIndex = (productIndex + 1) % offers.length;
			selectedVariantIndex = -1; // Reset variant selection for new offer
			updateProduct();
		});

		// Auto-advance carousel every 5 seconds
		setInterval(() => {
			currentIndex = (currentIndex + 1) % slides.length;
			updateCarousel();
		}, 5000);
	}
}();
