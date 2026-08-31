/**
 * @package Helix3 Framework
 * @author JoomShaper http://www.joomshaper.com
 * @copyright Copyright (c) 2010 - 2015 JoomShaper
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 or later
 */
jQuery(function ($) {
    //windowHeight
    var windowHeight = $(window).height();
    $(".error-page body, .sp-comingsoon body").css("height", windowHeight);

    $(window).resize(function () {
        "use strict",
            $(".error-page body, .sp-comingsoon body").css(
                "height",
                windowHeight
            );
    });

    var $body = $("body"),
        $wrapper = $(".body-innerwrapper"),
        $toggler = $("#offcanvas-toggler"),
        $close = $(".close-offcanvas"),
        $offCanvas = $(".offcanvas-menu");

    $("#offcanvas-toggler").on("click", function (event) {
        event.preventDefault();
        $("body").addClass("offcanvas");
    });

    $(".close-offcanvas, .offcanvas-overlay").on("click", function (event) {
        event.preventDefault();
        $("body").removeClass("offcanvas");
    });

    var stopBubble = function (e) {
        e.stopPropagation();
        return true;
    };

    //Mega Menu
    $(".sp-megamenu-wrapper")
        .parent()
        .parent()
        .css("position", "static")
        .parent()
        .css("position", "relative");
    $(".sp-menu-full").each(function () {
        $(this).parent().addClass("menu-justify");
    });

    //Sticky Menu
    $(document).ready(function () {
        $("body.sticky-header").find("#sp-header").sticky({ topSpacing: 0 });
    });

    //Shopping cart
    // var cartToggle = $('.vmCartModule .cart-container .cart-container-inner div.icon i.icon'),
    // hikashop_cart = $('.vmCartModule .cart-container');

    // cartToggle.on('click', function() {
    //     hikashop_cart.toggleClass('active');
    // });

    //lowyer cta animation
    var $delaytime = 150;
    $(".lawyer-cta-wrap > div.sppb-addon").each(function (k, v) {
        $(v)
            .addClass("sppb-wow fadeInUp")
            .attr("data-sppb-wow-delay", $delaytime + "ms");
        $delaytime += 150;
    });

    //Tooltip
    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    $(document).on("click", ".sp-rating .star", function (event) {
        event.preventDefault();

        var data = {
            action: "voting",
            user_rating: $(this).data("number"),
            id: $(this).closest(".post_rating").attr("id"),
        };

        var request = {
            option: "com_ajax",
            plugin: "helix3",
            data: data,
            format: "json",
        };

        $.ajax({
            type: "POST",
            data: request,
            beforeSend: function () {
                $(".post_rating .ajax-loader").show();
            },
            success: function (response) {
                var data = $.parseJSON(response.data);

                $(".post_rating .ajax-loader").hide();

                if (data.status == "invalid") {
                    $(".post_rating .voting-result")
                        .text("You have already rated this entry!")
                        .fadeIn("fast");
                } else if (data.status == "false") {
                    $(".post_rating .voting-result")
                        .text("Somethings wrong here, try again!")
                        .fadeIn("fast");
                } else if (data.status == "true") {
                    var rate = data.action;
                    $(".voting-symbol")
                        .find(".star")
                        .each(function (i) {
                            if (i < rate) {
                                $(".star")
                                    .eq(-(i + 1))
                                    .addClass("active");
                            }
                        });

                    $(".post_rating .voting-result")
                        .text("Thank You!")
                        .fadeIn("fast");
                }
            },
            error: function () {
                $(".post_rating .ajax-loader").hide();
                $(".post_rating .voting-result")
                    .text("Failed to rate, try again!")
                    .fadeIn("fast");
            },
        });
    });

    //For react template
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var newNodes = mutation.addedNodes;
            if (newNodes !== null) {
                var $nodes = $(newNodes);

                $nodes.each(function () {
                    var $node = $(this);
                    $node.find("#slide-fullwidth").each(function () {
                        var $slideFullwidth = $("#slide-fullwidth");
                        var $autoplay = $slideFullwidth.attr(
                            "data-sppb-slide-ride"
                        );
                        if ($autoplay == "true") {
                            var $autoplay = true;
                        } else {
                            var $autoplay = false;
                        }

                        var $controllers = $slideFullwidth.attr(
                            "data-sppb-slidefull-controllers"
                        );
                        if ($controllers == "true") {
                            var $controllers = true;
                        } else {
                            var $controllers = false;
                        }

                        $slideFullwidth.owlCarousel({
                            margin: 0,
                            loop: true,
                            video: true,
                            autoplay: $autoplay,
                            animateIn: "fadeIn",
                            animateOut: "fadeOut",
                            autoplayHoverPause: true,
                            autoplaySpeed: 1500,
                            responsive: {
                                0: {
                                    items: 1,
                                },
                                600: {
                                    items: 1,
                                },
                                1000: {
                                    items: 1,
                                },
                            },
                            dots: $controllers,
                        });

                        $(".sppbSlidePrev").click(function () {
                            $slideFullwidth.trigger("prev.owl.carousel", [400]);
                        });

                        $(".sppbSlideNext").click(function () {
                            $slideFullwidth.trigger("next.owl.carousel", [400]);
                        });

                        $("#slide-fullwidth .owl-controls").addClass(
                            "container"
                        );
                    });
                });
            }
        });
    });

    var config = {
        childList: true,
        subtree: true,
    };
    // Pass in the target node, as well as the observer options
    observer.observe(document.body, config);
});
