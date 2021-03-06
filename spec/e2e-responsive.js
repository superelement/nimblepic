/**
 * Because it is not possible to resize the window using JS, in Chrome (and I think all modern browsers), the karma-responsive.conf.js file specifies
 * certain window sizes. The values that we have set below must be exact matches to those window sizes (minus the scroll bar extra pixels added in the config),
 * as we make assumptions based on them.
 */

// give it 2 minutes
jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

var winW = window.nimblePic.testable.winWidth();

// some warnings can be quite irritating during tests, so we can suppress them here
window.nimblePic.suppressWarnings = true;

// non-exact breakpoint values
var isWideDt = false
  , isDt = winW === 1199
  , isTb = winW === 991
  , isMb = winW === 767
  , isNarrowMb = winW === 479


var isNonExact = isDt || isTb || isMb || isNarrowMb;

var createEl = window.testUtils.createEl
  , createImgEl = window.testUtils.createImgEl
  , getNewDivHeight = window.testUtils.getNewDivHeight
  , getUID = window.nimblePic.testable.getUID
  , getCompProp = window.testUtils.getCompProp
  , cleanupElement = window.testUtils.cleanupElement
  , $doc = $(document)
  , domain = "http://localhost:8081/"

var isRangeDt;

function printBreakPoint() {
	if(isWideDt) return "isWideDt";
	if(isDt) return "isDt";
	if(isRangeDt) return "isRangeDt";
	if(isTb) return "Tb";
	if(isMb) return "isMb";
	if(isNarrowMb) return "isNarrowMb";
}

function clearAll() {
	$("[data-resp-styles]").remove();
	$(".nimpic").remove();
}

//console.log("winW", winW, isNonExact);

// testing specific break points with non-exact breakpoint values
if(isNonExact) {

	describe("getResponsiveWidth with non-exact breakpoint values", function() {
		beforeEach(clearAll);
		var fun = window.nimblePic.testable.getResponsiveWidth

		it("should match break-point names to Bootstrap grid break points", function() {
				 if(isNarrowMb) expect(fun()).toBe('xs');
			else if(isMb) 		expect(fun()).toBe('sm');
			else if(isTb) 		expect(fun()).toBe('md');
			else if(isDt) 		expect(fun()).toBe('lg');
		});
	});


	describe("responsiveWidth with non-exact breakpoint values", function() {
		beforeEach(clearAll);
		var fun = window.nimblePic.testable.responsiveWidth

		it("should match break-point names to Bootstrap grid break points with 'less than' params", function() {
				 if(isNarrowMb) 	expect(fun('xs')).toBe(true);
			else if(isMb) 			expect(fun('sm')).toBe(true);
			else if(isTb) 			expect(fun('md')).toBe(true);
			else if(isDt) 			expect(fun('lg')).toBe(true);
		});

		it("should match break-point names to Bootstrap grid break points with 'more than' params", function() {
				 if(!isNarrowMb && isMb) 			expect(fun('xs', true)).toBe(true);
			else if(!isNarrowMb && !isMb && isTb)	expect(fun('sm', true)).toBe(true);
			else if(!isNarrowMb && !isMb && !isTb)	expect(fun('md', true)).toBe(true);
		});
	});

} else { // testing exact breakpoint values

	var isWideDt = winW === 1200
	  , isDt = winW === 992
	  , isTb = winW === 768
	  , isMb = winW === 480
	  , isNarrowMb = winW === 320;

	// 'isRangeDt' used on Safari, IE & FF because window size flags don't work, so assumes a height above 992 will be present, but can't use an exact value
	isRangeDt = winW >= 992 && !isDt && !isWideDt;

	if(!isRangeDt && !isWideDt && !isDt && !isTb && !isMb && !isNarrowMb)
		throw new Error("There must be a problem with the window sizes set in karma-responsive.conf.js for exact breakpoint values, as none of the expected values matched." + winW);

	describe("responsiveWidth with exact breakpoint values", function() {
		beforeEach(clearAll);
		var fun = window.nimblePic.testable.responsiveWidth

		it("should match break-point names to Bootstrap grid break points with 'more than or equal' params", function() {
				 if(isNarrowMb) 	expect(fun('xs', true, true)).toBe(false); // value is 320, but would need to be more than 480 to be successful
			else if(isMb) 			expect(fun('xs', true, true)).toBe(true);
			else if(isTb) 			expect(fun('sm', true, true)).toBe(true);
			else if(isDt) 			expect(fun('md', true, true)).toBe(true);
			else if(isWideDt) 		expect(fun('lg', true, true)).toBe(true);
			else if(isRangeDt)	{
				// so we can test FF & IE
					 if(winW < 1200)	expect(fun('md', true, true)).toBe(true);
				else if(winW >= 1200)	expect(fun('lg', true, true)).toBe(true);
			}
		});

		it("should NOT match break-point names to Bootstrap grid break points with 'more than' params", function() {
				 if(isMb) 			expect(fun('xs', true)).toBe(false);
			else if(isTb) 			expect(fun('sm', true)).toBe(false);
			else if(isDt) 			expect(fun('md', true)).toBe(false);
			else if(isWideDt) 		expect(fun('lg', true)).toBe(false);
			// can't test 'isRangeDt' because exact window width isn't set
		});
	});
}




describe("responsiveHeight", function() {
	beforeEach(clearAll);
	var fun = window.nimblePic.testable.responsiveHeight
	  , heightSm = 400
	  , heightMd = 768
	  , heightLg = 992;

	// no need to run these tests on every breakpoint
	if(isDt) {

		it("should clear a style element by id, by just passing 'justClear' param and 'customID'.", function() {
			var customID = getUID("some-unique-id-")
			  , justClear = true;

			createEl(customID, "style");

			expect(document.getElementById(customID)).toBeTruthy();
			fun(true, customID);
			expect(document.getElementById(customID)).toBeFalsy();
		});


		it("should clear a style element by id, by just passing 'clearExisting' param and 'customID'.", function() {
			var customID = getUID("some-unique-id-")
			  , clearExisting = true;
			  
			var styleEl = createEl(customID, "style");

			styleEl.innerHTML = ".test { background:blue; }";

			fun(null, customID, null, null, null, null, clearExisting);

			// tests that element exists, but has been cleared (because no new values were passed with the function call)
			styleEl = document.getElementById(customID);
			expect(styleEl).toBeTruthy();
			expect(styleEl.innerHTML).toBe("");

			cleanupElement(customID);
		});
	}



	it("should add a custom 'height' property for mobile on a custom selector and fail for all others", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")
		  

		fun(null, customID, "."+customCls, heightSm);

		var divH = getNewDivHeight(customCls);

		if(isMb || isNarrowMb)	expect(divH).toEqual(heightSm);
		else					expect(divH).toEqual(0);

		cleanupElement(customID);
	});



	it("should add a custom 'height' property for all breakpoints on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, null, heightMd);

		var divH = getNewDivHeight(customCls);

		expect(divH).toEqual(heightMd);

		cleanupElement(customID);
	});


	it("should add a custom 'height' property for all breakpoints (but a different value for mobile) on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, heightSm, heightMd);

		var divH = getNewDivHeight(customCls);

		if(isMb || isNarrowMb)	expect(divH).toEqual(heightSm);
		else					expect(divH).toEqual(heightMd);

		cleanupElement(customID);
	});


	it("should add a custom 'height' property for desktop breakpoints (and fail for others) on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, null, null, heightLg);

		var divH = getNewDivHeight(customCls);

		if(isDt || isWideDt || isRangeDt)	expect(divH).toEqual(heightLg);
		else								expect(divH).toEqual(0);

		cleanupElement(customID);
	});


	// TEST NOT WORKING (NEED TO FIX)
	it("should add a custom 'height' property for only the 2nd selector, because 'clearExisting' is set to true", function() {

		var customID = getUID("some-unique-id-")
		  , cls1 = getUID("some-class-")
		  , cls2 = getUID("some-class-")

		fun(null, customID, "."+cls1, null, null, heightLg);
		fun(null, customID, "."+cls2, null, null, heightLg, true); // passes 'clearExisting' as true

		var divH1 = getNewDivHeight(cls1)
		  , divH2 = getNewDivHeight(cls2);

		if(isDt || isWideDt || isRangeDt) {
			expect(divH1).toEqual(0);
			expect(divH2).toEqual(heightLg);
		}

		cleanupElement(customID);
	});
});

describe("responsiveHeight - 3 media queries on same element by ID, but with different classes", function() {
	
	beforeEach(function() {
		// clearing all will break test
		// beforeEach(clearAll);
	});

	var fun = window.nimblePic.testable.responsiveHeight
	  , heightSm = 400
	  , heightMd = 768
	  , heightLg = 992;

	var customID = getUID("some-unique-id-")
	  , cls1 = getUID("example1")
	  , cls2 = getUID("example2")
	  , cls3 = getUID("example3")

	// uses different classes for each call, but ame ID
	fun(null, customID, "."+cls1, heightSm);
	fun(null, customID, "."+cls2, null, heightMd);
	fun(null, customID, "."+cls3, null, null, heightLg);

	var divH1 = getNewDivHeight(cls1, true)
	  , divH2 = getNewDivHeight(cls2, true)
	  , divH3 = getNewDivHeight(cls3, true)

	it("should just succeed for mobile on div1", function() {
		if(isMb || isNarrowMb)	expect(divH1).toEqual(heightSm);
		else					expect(divH1).toEqual(0);
	});


	it("should succeed for all on div2", function() {
		expect(divH2).toEqual(heightMd);
	});


	it("should just succeed for desktop on div3", function() {
		if(isDt || isWideDt || isRangeDt)	expect(divH3).toEqual(heightLg);
		else								expect(divH3).toEqual(0);
	});
});

describe("responsiveImage", function() {
	beforeEach(clearAll);
	var fun = window.nimblePic.testable.responsiveImage
	  , srcSm = domain+"demos/img/example-1-35.jpg"
	  , srcMd = domain+"demos/img/example-1-58.jpg"
	  , defId = window.nimblePic.vars.DEF_SRC_STYLE_ID

	function bgImgExp(id, src, customID) {
		
		expect(getCompProp(id, "background-image")).toContain(src);

		if(!customID) customID = defId;

		cleanupElement(customID);
		
		expect(getCompProp(id, "background-image")).not.toContain(src);

		cleanupElement(id);
	}

	if(isMb || isNarrowMb) {
		it("should show mobile image using default style id", function() {
			var id = getUID("example1")
			  , cls = getUID("example1");

			fun(null, srcSm, srcMd, "."+cls);
			createImgEl(id, cls);

			bgImgExp(id, srcSm);
		});
	} else {
		it("should show tabet/desktop image using default style id", function() {
			var id = getUID("example2")
			  , cls = getUID("example2");

			fun(null, srcSm, srcMd, "."+cls);
			var el = createImgEl(id, cls);

			bgImgExp(id, srcMd);
		});
	}

	// could be on any break point, just adding condition so we're running it more than needed
	if(isMb) {
		it("should show image using custom style id and 'clearExisting' removing it", function() {
			var id = getUID("example3")
			  , cls = getUID("example3")
			  , customStyleID = getUID("example3");

			// runs the main function on a custom ID (for the style element)
			fun(null, srcSm, srcMd, "."+cls, null, null, null, null, customStyleID);
			createImgEl(id, cls);

			// tests that elements created contains the default bg image for the small size
			expect(getCompProp(id, "background-image")).toContain(srcSm);

			// now runs the main function again with the 'clearExisting' param as true, so we can verify the new (fake) src value gets applied
			var clearExisting = true;
			fun(null, "fake-src", srcMd, "."+cls, null, null, null, clearExisting, customStyleID);

			expect(getCompProp(id, "background-image")).toContain("fake-src");

			cleanupElement(id);
			cleanupElement(customStyleID);
		});
	} 

	if(isMb || isNarrowMb) {
		it("should show mobile image height applied", function() {
			var id = getUID("example4")
			  , cls = getUID("example4")
			  , heightSm = 200;

			fun(null, srcSm, srcMd, "."+cls, heightSm);
			createImgEl(id, cls);

			expect(document.getElementById(id).offsetHeight).toEqual(heightSm);

			cleanupElement(id);
			cleanupElement(defId);
		});
	} else if(isTb) {
		it("should show tablet image height applied", function() {
			var id = getUID("example5")
			  , cls = getUID("example5")
			  , heightMd = 400;

			fun(null, srcSm, srcMd, "."+cls, null, heightMd);
			createImgEl(id, cls);

			expect(document.getElementById(id).offsetHeight).toEqual(heightMd);

			cleanupElement(id);
			cleanupElement(defId);
		});
	} else if(isDt) {
		it("should show desktop image height applied", function() {
			var id = getUID("example5")
			  , cls = getUID("example5")
			  , heightLg = 600;

			fun(null, srcSm, srcMd, "."+cls, null, heightLg);
			createImgEl(id, cls);

			expect(document.getElementById(id).offsetHeight).toEqual(heightLg);

			cleanupElement(id);
			cleanupElement(defId);
		});
	}

	if(isMb || isNarrowMb) {
		it("should not show the bg image when on mobile and CSS class 'no-mb' is applied", function() {
			var id = getUID("example6")
			  , cls = getUID("example6")

			fun(null, srcSm, srcMd, "."+cls);
			var el = createImgEl(id, cls);

			el.classList.add("no-mb");

			// tests that elements created DOES NOT contain a bg image for the small size
			expect(getCompProp(id, "background-image")).not.toContain(srcSm);

			cleanupElement(el);
		});
	}
});

describe("isInvalidResponsiveSrc", function() {
	beforeEach(clearAll);
	var fun = window.nimblePic.testable.isInvalidResponsiveSrc

	if(isMb || isNarrowMb) {
		it("should return FALSE when mobile source is VALID", function() {
			
			var $el = $(createImgEl()); // must be a jQuery element
			expect(fun($el, "/path-to/img/mobile.jpg")).toBe(false);

			cleanupElement($el[0]);
		})

		it("should return TRUE when mobile source is INVALID", function() {
			
			var $el = $(createImgEl()); // must be a jQuery element
			
			// shouldn't be a boolean, should be a string
			expect(fun($el, true, "/a-valid/desktop/img.jpg")).toBe(true);

			cleanupElement($el[0]);
		})
		
	} else if(isDt) {
		it("should return FALSE when desktop source is VALID", function() {
			
			var $el = $(createImgEl()); // must be a jQuery element
			
			// first param is invalid because it's not a string
			expect(fun($el, 1, "/path-to/img/desktop.jpg")).toBe(false);

			cleanupElement($el[0]);
		})

		it("should return TRUE when desktop source is INVALID", function() {
			
			var $el = $(createImgEl()); // must be a jQuery element
			
			// shouldn't be a boolean, should be a string
			expect(fun($el, "/a-valid/mobile/img.jpg", true)).toBe(true);

			cleanupElement($el[0]);
		})
	}
})


describe("setImages", function() {
	beforeEach(clearAll);
	var fun = window.nimblePic.setImages
	  , srcSm = domain+"demos/img/example-1-35.jpg"
	  , srcMd = domain+"demos/img/example-1-58.jpg"

	function bgImgCheck(img, done) {
		if(isDt || isWideDt || isRangeDt || isTb)	expect(getCompProp(img, "background-image")).toContain(srcMd);
		else 										expect(getCompProp(img, "background-image")).toContain(srcSm);

		cleanupElement(img);
		if(done) done();
	}

	function setImgAttr(img) {
		img.setAttribute("data-img-sm", srcSm);
		img.setAttribute("data-img-md", srcMd);
	}

	describe("single image", function() {

		it("should load image by default CSS class name and check heights are native due to lack of 'data-height-x' attributes - " + printBreakPoint(), function(done) {
			
			var img = createImgEl();
			setImgAttr(img);

			fun($, null, null, getUID(), null, function(isSuccess, url, img, computedHeight, nativeHeight) {
				// image loaded callback
				expect(computedHeight).toEqual(nativeHeight);
				bgImgCheck(img, done);
			});
		})


		it("should load image by default CSS class name, but change the default to a custom class name and check the loader class name is also using the custon class as s prefix - " + printBreakPoint(), function(done) {
			var cls = "custom-img-class"
			  , img = createEl(null, "span", cls);
			setImgAttr(img);

			// changes the default class name to look for, including on loader
			window.nimblePic.setDefaultImageClass(cls);

			fun($, null, null, null, null, function(isSuccess, url, img, computedHeight, nativeHeight) {
				
				expect(img.querySelector("."+cls+"-ldr")).toBeTruthy();

				// resets the default so other tests don't fail
				window.nimblePic.setDefaultImageClass(null, true);

				// image loaded callback
				bgImgCheck(img, done);
			});
		})

		it("should load image by custom CSS class name - " + printBreakPoint(), function(done) {

			var cls = getUID()
			  , img = createImgEl(null, cls); // creates image with custom class
			setImgAttr(img);

			// passes the custom class
			fun($, null, cls, getUID(), null, function(isSuccess, url, img, computedHeight, nativeHeight) {
				// image loaded callback
				bgImgCheck(img, done);
			});
		})

		it("should load image by custom CSS class name on a custom container - " + printBreakPoint(), function(done) {

			var cont = createEl() // creates an empty container element
			  , cls = getUID()
			  , img = createImgEl(null, cls, cont); // attaches the image to the container

			setImgAttr(img);

			// passes the container and custom class
			fun($, $(cont), cls, getUID(), null, function(isSuccess, url, img, computedHeight, nativeHeight) {
				// image loaded callback
				
				bgImgCheck(img, done);
			});
		})

		it("should load image by custom CSS class name on a parent selector - " + printBreakPoint(), function(done) {

			var parentCls = getUID()
			  , cont = createEl(null, null, parentCls) // creates an empty container element
			  , cls = getUID()
			  , img = createImgEl(null, cls, cont); // attaches the image to the container

			setImgAttr(img);

			// passes the container and custom class
			fun($, null, cls, getUID(), parentCls, function(isSuccess, url, img, computedHeight, nativeHeight) {
				// image loaded callback
				bgImgCheck(img, done);
			});
		})


		it("should load image by delayed event, including custom event callback - " + printBreakPoint(), function(done) {
			
			var img = createImgEl();
			setImgAttr(img);

			var uniqueEventName = getUID("unique-event-name");
			img.setAttribute("data-delay-image-load-event", uniqueEventName);

			fun($, null, null, getUID(), null);

			var imgLoadedCB = function() {
				bgImgCheck(img, done);
			}

			setTimeout(function() {
				$doc.trigger(uniqueEventName, {cb:imgLoadedCB});
			}, 500);
		})


		it("should load image by default CSS class name with all 3 heights from data attributes - " + printBreakPoint(), function(done) {
			
			var img = createImgEl();
			setImgAttr(img, true);

			img.setAttribute("data-height-sm", 300);
			img.setAttribute("data-height-md", 400);
			img.setAttribute("data-height-lg", 500);

			fun($, null, null, getUID(), null, function(isSuccess, url, img, computedHeight, nativeHeight) {
				// image loaded callback

				if(isNarrowMb || isMb)				expect(computedHeight).toEqual(300);
				if(isTb) 							expect(computedHeight).toEqual(400);
				if(isWideDt || isDt || isRangeDt) 	expect(computedHeight).toEqual(500);

				cleanupElement(img);
				done();
			});
		})
		

		it("should load image by default CSS class name with just small and medium heights from data attributes - " + printBreakPoint(), function(done) {
			
			var img = createImgEl();
			setImgAttr(img, true);

			img.setAttribute("data-height-sm", 350);

			fun($, null, null, getUID(), null, function(isSuccess, url, img, computedHeight, nativeHeight) {
				// image loaded callback

				if(isNarrowMb || isMb)	expect(computedHeight).toEqual(350);
				else 					expect(computedHeight).toEqual(nativeHeight); // data-height attributes should only be affecting mobile break points

				cleanupElement(img);
				done();
			});
		})

	})

	describe("multiple images", function() {
		var src = {
			sm1: domain + "demos/img/example-1-35.jpg"
		  , md1: domain + "demos/img/example-1-58.jpg"
		  , sm2: domain + "demos/img/example-2-35.jpg"
		  , md2: domain + "demos/img/example-2-58.jpg"
		  , sm3: domain + "demos/img/example-3-35.jpg"
		  , md3: domain + "demos/img/example-3-58.jpg"
		  , sm4: domain + "demos/img/example-4-35.jpg"
		  , md4: domain + "demos/img/example-4-58.jpg"
		}


		function setMultiImgAttr(img, srcNum) {

			if(srcNum === 1) {
				img.setAttribute("data-img-sm", src.sm1);
				img.setAttribute("data-img-md", src.md1);
			} else if(srcNum === 2) {
				img.setAttribute("data-img-sm", src.sm2);
				img.setAttribute("data-img-md", src.md2);
			} else if(srcNum === 3) {
				img.setAttribute("data-img-sm", src.sm3);
				img.setAttribute("data-img-md", src.md3);
			} else if(srcNum === 4) {
				img.setAttribute("data-img-sm", src.sm4);
				img.setAttribute("data-img-md", src.md4);
			}
		}

		function checkMultiImgStylesExist(styleId, images, count) {
			
			// must wait until all images are loaded before checking contents
			var styleEl = document.getElementById(styleId).innerHTML;
			//console.log("styleEl", styleEl);

			for(var i = 1; i <= count; i++) {

				// checks that all mobile styles exist in group
				expect(styleEl).toContain(src["sm"+i]);

				// checks that all desktop styles exist in group
				expect(styleEl).toContain(src["md"+i]);

				cleanupElement(images["img"+i]);
			}
		}



		it("should check 'isSuccess' argument in 'loadedCB' are working for success on 4 different images - " + printBreakPoint(), function(done) {
			var loadedCount = 0;

			var images = {
				  img1: createImgEl()
				, img2: createImgEl()
				, img3: createImgEl()
				, img4: createImgEl()
			}

			setMultiImgAttr(images.img1, 1);
			setMultiImgAttr(images.img2, 2);
			setMultiImgAttr(images.img3, 3);
			setMultiImgAttr(images.img4, 4);


			fun($, null, null, null, null, function(isSuccess, url, img, computedHeight, nativeHeight) {
				expect(isSuccess).toBe(true);

				cleanupElement(img);
				loadedCount++;
				if(loadedCount === 4) done();
			})
		})


		it("should check 'isSuccess' and 'url' arguments in 'loadedCB' are working for success and fail - " + printBreakPoint(), function(done) {
			var sucImg = createImgEl()
			  , errImg = createImgEl()
			  , loadedCount = 0
			  , nonEx1 = "non-existant-image-1.jpg"
			  , nonEx2 = "non-existant-image-2.jpg";

			setMultiImgAttr(sucImg, 1);

			// set non-existant image paths for image that expects an error
			errImg.setAttribute("data-img-sm", nonEx1);
			errImg.setAttribute("data-img-md", nonEx2);

			fun($, null, null, null, null, function(isSuccess, url, img, computedHeight, nativeHeight) {
				if(img === sucImg) {
					expect(isSuccess).toBe(true);
					if(isTb || isDt || isWideDt || isRangeDt) 	expect(url).toBe(src.md1);
					else 										expect(url).toBe(src.sm1);
				} else if(img === errImg) {
					expect(isSuccess).toBe(false);
					if(isTb || isDt || isWideDt || isRangeDt) 	expect(url).toBe(nonEx2);
					else 										expect(url).toBe(nonEx1);
				}

				cleanupElement(img);
				loadedCount++;
				if(loadedCount === 2) done();
			})
		})


		it("should show how calling the method more than once clears previous images when 'customCls' or 'customStyleID' is NOT passed, plus how it attaches 'no-img' class to previous images - " + printBreakPoint(), function(done) {
			var img1 = createImgEl();
			setMultiImgAttr(img1, 1);
			img1.setAttribute("id", "test-img-1");

			fun($, null, null, null, null, function(isSuccess, url, img, computedHeight, nativeHeight) {

				var url1 = url;
				expect(getCompProp(img1, "background-image")).toContain(url1);
				
				var img2 = createImgEl();
				setMultiImgAttr(img2, 2);
				fun($, null, null, null, null, function(isSuccess, url, img, computedHeight, nativeHeight) {
					
					if(img === img2) {
						expect(getCompProp(img1, "background-image")).toContain(url1);
						expect(getCompProp(img2, "background-image")).toContain(url);
						cleanupElement(img1);
						cleanupElement(img2);
						done();
					}
				})
			})
		})


		it("should show that multiple image styles get included in same style, using the default style id", function(done) {
			var loadedCount = 0

			var images = {
				  img1: createImgEl()
				, img2: createImgEl()
				, img3: createImgEl()
				, img4: createImgEl()
			}

			setMultiImgAttr(images.img1, 1);
			setMultiImgAttr(images.img2, 2);
			setMultiImgAttr(images.img3, 3);
			setMultiImgAttr(images.img4, 4);

			fun($, null, null, null, null, function(isSuccess, url, img, computedHeight, nativeHeight) {

				loadedCount++;
				if(loadedCount === 4)  {
					checkMultiImgStylesExist(window.nimblePic.vars.DEF_SRC_STYLE_ID, images, 4);
					done();
				}
			})
		})


		it("should show that images within the same group (using 'data-img-group') get there own style element and ID based on the group name and that default image styles are not affected. Also checks that height styles are not removed when image styles are applied.", function(done) {
			var loadedCount = 0
			  , groupName = "example-group";

			var groupImg = {
				  img1: createImgEl()
				, img2: createImgEl()
			}

			var normalImg = {
				  img1: createImgEl()
				, img2: createImgEl()
			}

			// sets group image attributes
			setMultiImgAttr(groupImg.img1, 1);
			setMultiImgAttr(groupImg.img2, 2);

			// sets normal image attributes
			setMultiImgAttr(normalImg.img1, 1);
			setMultiImgAttr(normalImg.img2, 2);

			// adds group attribute to group images only
			groupImg.img1.setAttribute('data-img-group', groupName);
			groupImg.img2.setAttribute('data-img-group', groupName);

			// set heights so we can test their styles are kept
			groupImg.img1.setAttribute("data-height-sm", 300);
			groupImg.img2.setAttribute("data-height-sm", 300);


			// ensures that heights styles have not been removed while we wait for images to load (for group) and again once they have loaded
			var checkGroupHeightStylesExist = function() {

				var smSrc = src.sm1
				  , styleEl = document.getElementById(groupName).innerHTML

				 // first checks that the style element is not empty (if heights are provided, it should not be empty)
				 expect(styleEl).not.toBe("");

				// then gets the unique class name of the style with the smSrc
				var smSrcCustomID = ".nimblepic-custom-" + styleEl.split(smSrc)[0].split(".nimblepic-custom-")[1].split("{")[0].trim();

				// then gets the first occurance of this unique class name, which should contain height info and no image info
				var contentsOfFirstOccurance = styleEl.split(smSrcCustomID)[1].split("}")[0];
				
				expect(contentsOfFirstOccurance).not.toContain("background-image");
			}


			fun($, null, null, null, null, function(isSuccess, url, img, computedHeight, nativeHeight) {

				loadedCount++;
				if(loadedCount === 4)  {
					checkGroupHeightStylesExist();

					// checks group image styles exist
					checkMultiImgStylesExist(groupName, groupImg, 2, true);

					// checks normal image styles exist
					checkMultiImgStylesExist(window.nimblePic.vars.DEF_SRC_STYLE_ID, normalImg, 2);
					done();
				}
			}, checkGroupHeightStylesExist);

		})

		it("should show that images within delayed events (using 'data-delay-image-load-event') get there own style element and ID based on the event name and that default image styles are not affected.", function(done) {
			
			var uniqueEventName = "example-event";

			var dynEvtImg = createImgEl();
			setImgAttr(dynEvtImg);
			
			// adds delayed event attribute
			dynEvtImg.setAttribute('data-delay-image-load-event', uniqueEventName);

			var normalImg = createImgEl();
			setImgAttr(normalImg);


			fun($, null, null, null, null, function(isSuccess, url, img, computedHeight, nativeHeight) {

				// once normal image loaded, triggers event to load other image
				if(normalImg === img) {

					setTimeout(function() {
						$doc.trigger(uniqueEventName);
					}, 500);
					
				} else { // once dynamic event image has loaded uses 'checkMultiImgStylesExist' to check a single image, rather than a list, but logic is the same

					checkMultiImgStylesExist(uniqueEventName, {img1:dynEvtImg}, 1);
					checkMultiImgStylesExist(window.nimblePic.vars.DEF_SRC_STYLE_ID, {img1:normalImg}, 1);
					done();
				}
			})
		})
	})

})
