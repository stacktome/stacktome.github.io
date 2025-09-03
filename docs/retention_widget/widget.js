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
		// Parse offers data
		const offersData = container.querySelector('#offers-data');
		const offers = offersData ? JSON.parse(offersData.value) : [];
		
		// Get all offer cards
		const offerCards = container.querySelectorAll('.offer-card');
		const nextOfferBtn = container.querySelector('#new-offer-btn');
		const prevOfferBtn = container.querySelector('#prev-offers-btn');
		
		// Check if we're on mobile (single card) or desktop (multiple cards)
		const isMobile = () => window.innerWidth < 768;
		const getVisibleCardCount = () => isMobile() ? 1 : Math.min(3, offerCards.length);
		
		// Track current offer set (starting index for visible offers)
		let currentOfferSet = 0;
		const maxOfferSets = Math.max(0, offers.length - getVisibleCardCount());
		
		// Track state for each card
		const cardStates = {};
		
		// Initialize each offer card
		offerCards.forEach((card, cardIndex) => {
			cardStates[cardIndex] = {
				currentImageIndex: 0,
				selectedVariantIndex: -1,
				offerIndex: cardIndex
			};
			
			initializeOfferCard(card, cardIndex);
		});

		// Single auto-advance carousel for all cards every 5 seconds
		setInterval(() => {
			offerCards.forEach((card, cardIndex) => {
				const slides = card.querySelectorAll('.carousel-slide img');
				if (slides.length > 0) {
					cardStates[cardIndex].currentImageIndex = (cardStates[cardIndex].currentImageIndex + 1) % slides.length;
					const track = card.querySelector('.carousel-track');
					if (track) {
						track.style.transform = `translateX(-${cardStates[cardIndex].currentImageIndex * 100}%)`;
					}
					
					// Update dots
					const dots = card.querySelectorAll('.dot');
					dots.forEach((dot, index) => {
						if (index === cardStates[cardIndex].currentImageIndex) {
							dot.classList.add('active');
						} else {
							dot.classList.remove('active');
						}
					});
				}
			});
		}, 5000);
		
		function initializeOfferCard(card, cardIndex) {
			const track = card.querySelector('.carousel-track');
			const slides = card.querySelectorAll('.carousel-slide img');
			const nextButton = card.querySelector('.carousel-button.next');
			const prevButton = card.querySelector('.carousel-button.prev');
			const dots = card.querySelectorAll('.dot');
			
			// Image carousel controls
			if (nextButton) {
				nextButton.addEventListener('click', () => {
					cardStates[cardIndex].currentImageIndex = (cardStates[cardIndex].currentImageIndex + 1) % slides.length;
					updateCarousel();
				});
			}
			
			if (prevButton) {
				prevButton.addEventListener('click', () => {
					cardStates[cardIndex].currentImageIndex = (cardStates[cardIndex].currentImageIndex - 1 + slides.length) % slides.length;
					updateCarousel();
				});
			}
			
			dots.forEach(dot => {
				dot.addEventListener('click', () => {
					cardStates[cardIndex].currentImageIndex = parseInt(dot.getAttribute('data-index'));
					updateCarousel();
				});
			});
			
			// Update offer content for this card
			updateOfferCard();
			
			function updateOfferCard() {
				const offerIndex = cardStates[cardIndex].offerIndex;
				const currentOffer = offers[offerIndex % offers.length]; // Wrap around if needed
				
				if (!currentOffer) return;
				
				// Track offer impression
				trackOfferImpression(currentOffer, offerIndex);
				
				// Show loading indicator
				const imageLoadingIndicator = card.querySelector('.loading-indicator');
				if (imageLoadingIndicator) {
					imageLoadingIndicator.style.display = 'flex';
				}
				
				// Update carousel images
				let imagesLoaded = 0;
				const totalImages = slides.length;
				
				slides.forEach((slide, i) => {
					const newSrc = currentOffer.productImages[i] || currentOffer.productImages[0];
					
					const img = new Image();
					img.onload = function() {
						slide.src = newSrc;
						slide.alt = `Product Image ${i + 1}`;
						imagesLoaded++;
						
						if (imagesLoaded === totalImages && imageLoadingIndicator) {
							imageLoadingIndicator.style.display = 'none';
						}
					};
					img.onerror = function() {
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
				card.querySelector('.product-name').textContent = currentOffer.productName;
				card.querySelector('.more-info-link').href = currentOffer.productUrl || '#';
				card.querySelector('.more-info-link').dataset.offerId = currentOffer.offerId;
				card.querySelector('.checkout-btn').dataset.offerId = currentOffer.offerId;
				card.querySelector('.checkout-btn').dataset.offerUrl = currentOffer.offerUrl;
				
				// Update discount badge
				updateDiscountBadge(card, currentOffer);
				
				// Update expiration badge
				updateExpirationBadge(card, currentOffer);
				
				// Handle product variants
				handleProductVariants(card, currentOffer, cardIndex);
				
				// Update price display and button state
				updatePriceDisplay(card, currentOffer, cardIndex);
				updateBuyButtonState(card, currentOffer, cardIndex);
				
				// Update description
				updateProductDescription(card, currentOffer);
				
				// Update rating and reviews
				updateRatingAndReviews(card, currentOffer);
				
				// Setup checkout button
				setupCheckoutButton(card, currentOffer, cardIndex);
				
				updateCarousel();
			}
			
			function updateCarousel() {
				track.style.transform = `translateX(-${cardStates[cardIndex].currentImageIndex * 100}%)`;
				
				dots.forEach((dot, index) => {
					if (index === cardStates[cardIndex].currentImageIndex) {
						dot.classList.add('active');
					} else {
						dot.classList.remove('active');
					}
				});
			}
			
			// Note: Auto-advance carousel moved outside to prevent multiple intervals
		}
		
		// Helper functions for updating card content
		function trackOfferImpression(currentOffer, index) {
			if(window.stSnowplow){
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
							offerExpiration: minutesUntilExpiration,
							productIndex: index
						}
					}
				});
			}
		}
		
		function updateDiscountBadge(card, currentOffer) {
			const discountBadge = card.querySelector('.discount-badge');
			if (!discountBadge) return;
			
			let discountText = '';
			let badgeClass = 'discount-badge';
			
			switch(currentOffer.offerType) {
				case 'discountPercent':
					discountText = `-${currentOffer.offerValue}%`;
					badgeClass += ' percent';
					break;
				case 'discountFixed':
					discountText = `-${currentOffer.productPriceCurrencySymbol}${currentOffer.offerValue}`;
					badgeClass += ' fixed';
					break;
				case 'discountCredit':
					discountText = `+${currentOffer.productPriceCurrencySymbol}${currentOffer.offerValue}`;
					badgeClass += ' credit';
					break;
				case 'freeProduct':
					discountText = 'FREE';
					badgeClass += ' free';
					break;
			}
			
			discountBadge.textContent = discountText;
			discountBadge.className = badgeClass;
		}
		
		function updateExpirationBadge(card, currentOffer) {
			const expirationBadge = card.querySelector('.expiration-badge');
			if (!expirationBadge || !currentOffer.expireAt) return;
			
			const now = new Date();
			const expireDate = new Date(currentOffer.expireAt);
			
			if (expireDate <= now) {
				expirationBadge.style.display = 'none';
				return;
			}
			
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
				formattedText = `Ends in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
				if (remainingHours > 0) {
					formattedText += ` and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
				}
			}
			
			expirationBadge.textContent = formattedText;
			expirationBadge.style.display = 'block';
		}
		
		function handleProductVariants(card, currentOffer, cardIndex) {
			const variantsContainer = card.querySelector('.product-variants-container');
			const variantDropdown = card.querySelector('.variant-dropdown');
			
			if (currentOffer.productVariations && currentOffer.productVariations.length > 0) {
				variantsContainer.style.display = 'block';
				variantDropdown.innerHTML = '';
				
				const placeholderOption = document.createElement('option');
				placeholderOption.value = '';
				placeholderOption.textContent = 'Please select an option';
				placeholderOption.disabled = true;
				placeholderOption.selected = true;
				variantDropdown.appendChild(placeholderOption);
				
				currentOffer.productVariations.forEach((variant, index) => {
					const option = document.createElement('option');
					option.value = index;
					option.textContent = `${variant.name} - ${currentOffer.productPriceCurrencySymbol}${variant.price.toFixed(2)}`;
					variantDropdown.appendChild(option);
				});
				
				if (cardStates[cardIndex].selectedVariantIndex >= currentOffer.productVariations.length) {
					cardStates[cardIndex].selectedVariantIndex = -1;
				}
				
				variantDropdown.value = cardStates[cardIndex].selectedVariantIndex >= 0 ? cardStates[cardIndex].selectedVariantIndex : '';
				
				variantDropdown.onchange = function() {
					cardStates[cardIndex].selectedVariantIndex = this.value === '' ? -1 : parseInt(this.value);
					updatePriceDisplay(card, currentOffer, cardIndex);
					updateBuyButtonState(card, currentOffer, cardIndex);
				};
			} else {
				variantsContainer.style.display = 'none';
				cardStates[cardIndex].selectedVariantIndex = -1;
			}
		}
		
		function updatePriceDisplay(card, currentOffer, cardIndex) {
			let basePrice = parseFloat(currentOffer.productPrice);
			
			if (currentOffer.productVariations && currentOffer.productVariations.length > 0 && cardStates[cardIndex].selectedVariantIndex >= 0) {
				const selectedVariant = currentOffer.productVariations[cardStates[cardIndex].selectedVariantIndex];
				if (selectedVariant) {
					basePrice = parseFloat(selectedVariant.price);
				}
			}
			
			const currencySymbol = currentOffer.productPriceCurrencySymbol;
			let finalPrice = basePrice;
			
			switch(currentOffer.offerType) {
				case 'discountPercent':
					finalPrice = basePrice * (1 - currentOffer.offerValue / 100);
					break;
				case 'discountFixed':
					finalPrice = basePrice - currentOffer.offerValue;
					break;
				case 'discountCredit':
					finalPrice = basePrice;
					break;
				case 'freeProduct':
					finalPrice = 0;
					break;
			}
			
			card.querySelector('.current-price').textContent = `${currencySymbol}${finalPrice.toFixed(2)}`;
			card.querySelector('.original-price').textContent = `${currencySymbol}${basePrice.toFixed(2)}`;
			
			const shouldShowOriginalPrice = currentOffer.offerType === 'discountPercent' || 
										currentOffer.offerType === 'discountFixed' || 
										currentOffer.offerType === 'freeProduct';
			card.querySelector('.original-price').style.display = shouldShowOriginalPrice ? 'inline' : 'none';
			
			const priceContainer = card.querySelector('.product-price');
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
		
		function updateBuyButtonState(card, currentOffer, cardIndex) {
			const checkoutBtn = card.querySelector('.checkout-btn');
			
			if (currentOffer.productVariations && currentOffer.productVariations.length > 0 && cardStates[cardIndex].selectedVariantIndex === -1) {
				checkoutBtn.style.opacity = '0.6';
				checkoutBtn.style.cursor = 'not-allowed';
				checkoutBtn.textContent = 'Select option to buy';
			} else {
				checkoutBtn.style.opacity = '1';
				checkoutBtn.style.cursor = 'pointer';
				checkoutBtn.textContent = 'Buy now';
			}
		}
		
		function updateProductDescription(card, currentOffer) {
			const description = currentOffer.productDescription || '';
			const descriptionElem = card.querySelector('.product-description');
			const showMoreBtn = card.querySelector('.show-more-btn');
			
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
		}
		
		function updateRatingAndReviews(card, currentOffer) {
			const ratingContainer = card.querySelector('.product-rating');
			const filledStars = card.querySelector('.filled-stars');
			const ratingCount = card.querySelector('.rating-count');
			
			if (currentOffer.rating && currentOffer.reviewCount && filledStars && ratingCount) {
				if (ratingContainer) {
					ratingContainer.style.display = 'block';
				}
				filledStars.style.width = `${currentOffer.rating * 20}%`;
				ratingCount.textContent = `${currentOffer.reviewCount} reviews`;
			} else {
				if (ratingContainer) {
					ratingContainer.style.display = 'none';
				}
			}
		}
		
		function setupCheckoutButton(card, currentOffer, cardIndex) {
			const checkoutBtn = card.querySelector('.checkout-btn');
			const moreInfoLink = card.querySelector('.more-info-link');
			
			if (checkoutBtn) {
				checkoutBtn.onclick = function(e) {
					e.preventDefault();
					
					// Track checkout action
					if(window.stSnowplow){
						const now = new Date();
						const expireDate = new Date(currentOffer.expireAt);
						const minutesUntilExpiration = expireDate && expireDate > now ? Math.floor((expireDate - now) / (1000 * 60)) : 0;
						
						window.stSnowplow('trackSelfDescribingEvent', {
							event: {
								schema: 'iglu:com.stacktome/offer_action/jsonschema/1-0-0',
								data: {
									type: 'checkout',
									productSku: currentOffer.productSku,
									productRating: currentOffer.rating,
									productReviewCount: currentOffer.reviewCount,
									productPrice: currentOffer.productPrice,
									customerKey: currentOffer.customerKey,
									couponCode: currentOffer.couponCode,
									offerId: currentOffer.offerId,
									offerName: currentOffer.offerName,
									offerType: currentOffer.offerType,
									offerValue: currentOffer.offerValue,
									offerUrl: currentOffer.offerUrl,
									offerExpiration: minutesUntilExpiration
								}
							}
						});
					}
					
					// Check if variants exist and none is selected
					if (currentOffer.productVariations && currentOffer.productVariations.length > 0 && cardStates[cardIndex].selectedVariantIndex === -1) {
						const variantDropdown = card.querySelector('.variant-dropdown');
						if (variantDropdown) {
							variantDropdown.style.borderColor = '#e74c3c';
							variantDropdown.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.5)';
							variantDropdown.focus();
							
							setTimeout(() => {
								variantDropdown.style.borderColor = '#ddd';
								variantDropdown.style.boxShadow = 'none';
							}, 3000);
						}
						return;
					}
					
					let offerUrl = currentOffer.offerUrl;
					
					if (currentOffer.productVariations && currentOffer.productVariations.length > 0 && cardStates[cardIndex].selectedVariantIndex >= 0) {
						const selectedVariant = currentOffer.productVariations[cardStates[cardIndex].selectedVariantIndex];
						if (selectedVariant && selectedVariant.sku) {
							offerUrl = offerUrl.replace(currentOffer.productSku, selectedVariant.sku);
						}
					}
					
					if (offerUrl) {
						window.open(offerUrl, '_blank');
					}
				};
			}
			
			if (moreInfoLink) {
				moreInfoLink.onclick = function(e) {
					if(window.stSnowplow){
						const now = new Date();
						const expireDate = new Date(currentOffer.expireAt);
						const minutesUntilExpiration = expireDate && expireDate > now ? Math.floor((expireDate - now) / (1000 * 60)) : 0;
						
						window.stSnowplow('trackSelfDescribingEvent', {
							event: {
								schema: 'iglu:com.stacktome/offer_action/jsonschema/1-0-0',
								data: {
									type: 'more_info',
									productSku: currentOffer.productSku,
									productRating: currentOffer.rating,
									productReviewCount: currentOffer.reviewCount,
									productPrice: currentOffer.productPrice,
									customerKey: currentOffer.customerKey,
									couponCode: currentOffer.couponCode,
									offerId: currentOffer.offerId,
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
			}
		}
		
		// Update all offer cards when navigation happens
		function updateAllOfferCards() {
			offerCards.forEach((card, cardIndex) => {
				cardStates[cardIndex].offerIndex = currentOfferSet + cardIndex;
				cardStates[cardIndex].selectedVariantIndex = -1;
				cardStates[cardIndex].currentImageIndex = 0;
				
				const track = card.querySelector('.carousel-track');
				const slides = card.querySelectorAll('.carousel-slide img');
				const dots = card.querySelectorAll('.dot');
				
				// Re-initialize the card with new offer data
				initializeOfferCard(card, cardIndex);
			});
		}
		
		// Navigation button handlers
		if (nextOfferBtn) {
			nextOfferBtn.addEventListener('click', () => {
				const visibleCount = getVisibleCardCount();
				if (isMobile()) {
					// Mobile: increment by 1
					currentOfferSet = (currentOfferSet + 1) % offers.length;
				} else {
					// Desktop: increment by 3, wrap around
					currentOfferSet = (currentOfferSet + visibleCount) % offers.length;
				}
				updateAllOfferCards();
			});
		}
		
		if (prevOfferBtn) {
			prevOfferBtn.addEventListener('click', () => {
				const visibleCount = getVisibleCardCount();
				if (isMobile()) {
					// Mobile: decrement by 1
					currentOfferSet = (currentOfferSet - 1 + offers.length) % offers.length;
				} else {
					// Desktop: decrement by 3, wrap around
					currentOfferSet = (currentOfferSet - visibleCount + offers.length) % offers.length;
				}
				updateAllOfferCards();
			});
		}

		// Global function for template's onclick handler
		window.copyCoupon = function(couponCode, buttonElement) {
			if (!buttonElement) {
				console.error('Button element not provided to copyCoupon function');
				return;
			}
			
			const originalText = buttonElement.textContent;
			buttonElement.textContent = 'Copied!';
			buttonElement.style.background = '#28a745';
			buttonElement.style.color = 'white';
			
			navigator.clipboard.writeText(couponCode).then(() => {
				showCopyToast();
			}).catch(() => {
				// Fallback for older browsers
				const textArea = document.createElement('textarea');
				textArea.value = couponCode;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				showCopyToast();
			});
			
			// Reset button after 1.5 seconds
			setTimeout(() => {
				buttonElement.textContent = originalText;
				buttonElement.style.background = '';
				buttonElement.style.color = '';
			}, 1500);
		};
	}
}();
