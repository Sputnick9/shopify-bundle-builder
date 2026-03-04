(function () {
  "use strict";

  var SVG = {
    cart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    minus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    chevronUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    zap: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    tag: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    arrowUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
    package: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'
  };

  function formatMoney(cents) {
    return "$" + (cents / 100).toFixed(2);
  }

  function formatMoneyShort(cents) {
    var val = cents / 100;
    return val === Math.floor(val) ? "$" + val : "$" + val.toFixed(2);
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "className") {
          node.className = attrs[key];
        } else if (key === "innerHTML") {
          node.innerHTML = attrs[key];
        } else if (key.indexOf("on") === 0) {
          node.addEventListener(key.substring(2).toLowerCase(), attrs[key]);
        } else {
          node.setAttribute(key, attrs[key]);
        }
      });
    }
    if (children) {
      if (typeof children === "string") {
        node.textContent = children;
      } else if (Array.isArray(children)) {
        children.forEach(function (c) {
          if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
        });
      } else {
        node.appendChild(children);
      }
    }
    return node;
  }

  function BundleBuilder(container) {
    this.container = container;
    this.sectionId = container.dataset.sectionId || "bundle";
    this.cartItems = [];
    this.expandedProductId = null;
    this.drawerOpen = false;
    this.isSubmitting = false;

    var dataEl = document.getElementById("BundleBuilderData-" + this.sectionId);
    if (dataEl) {
      try {
        var data = JSON.parse(dataEl.textContent);
        this.discountTiers = (data.discountTiers || []).sort(function (a, b) {
          return a.minItems - b.minItems;
        });
        this.products = data.products || [];
        this.categories = data.categories || [];
      } catch (e) {
        console.error("BundleBuilder: failed to parse data", e);
        this.discountTiers = [];
        this.products = [];
        this.categories = [];
      }
    } else {
      this.discountTiers = [];
      this.products = [];
      this.categories = [];
    }

    this.init();
  }

  BundleBuilder.prototype.init = function () {
    this.renderTabs();
    this.renderCategories();
    this.renderCartBar();
    this.renderDrawer();
    this.bindTabClicks();
  };

  BundleBuilder.prototype.getGridColumns = function () {
    var w = window.innerWidth;
    if (w >= 1024) return 4;
    if (w >= 640) return 3;
    return 2;
  };

  BundleBuilder.prototype.isDirectAdd = function (product) {
    return !product.variants || product.variants.length <= 1;
  };

  BundleBuilder.prototype.getCartQty = function (variantId) {
    for (var i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].variantId === variantId) return this.cartItems[i].quantity;
    }
    return 0;
  };

  BundleBuilder.prototype.getProductCartCount = function (product) {
    var count = 0;
    var variants = product.variants || [];
    for (var i = 0; i < this.cartItems.length; i++) {
      for (var j = 0; j < variants.length; j++) {
        if (this.cartItems[i].variantId === variants[j].id) {
          count += this.cartItems[i].quantity;
        }
      }
    }
    return count;
  };

  BundleBuilder.prototype.addVariant = function (variantId) {
    var found = false;
    for (var i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].variantId === variantId) {
        this.cartItems[i].quantity++;
        found = true;
        break;
      }
    }
    if (!found) {
      this.cartItems.push({ variantId: variantId, quantity: 1 });
    }
    this.onCartChanged();
  };

  BundleBuilder.prototype.removeVariant = function (variantId) {
    for (var i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].variantId === variantId) {
        if (this.cartItems[i].quantity <= 1) {
          this.cartItems.splice(i, 1);
        } else {
          this.cartItems[i].quantity--;
        }
        break;
      }
    }
    this.onCartChanged();
  };

  BundleBuilder.prototype.resolveCartItem = function (cartItem) {
    for (var i = 0; i < this.products.length; i++) {
      var p = this.products[i];
      var variants = p.variants || [];
      for (var j = 0; j < variants.length; j++) {
        if (variants[j].id === cartItem.variantId) {
          return {
            variantId: cartItem.variantId,
            variantName: variants[j].name,
            variantImage: variants[j].image || null,
            gradientFrom: variants[j].gradientFrom || "#F3F4F6",
            gradientTo: variants[j].gradientTo || "#D1D5DB",
            productName: p.name,
            price: p.price,
            quantity: cartItem.quantity
          };
        }
      }
    }
    return null;
  };

  BundleBuilder.prototype.getTotals = function () {
    var self = this;
    var itemCount = 0;
    var subtotal = 0;
    this.cartItems.forEach(function (ci) {
      var resolved = self.resolveCartItem(ci);
      if (resolved) {
        itemCount += ci.quantity;
        subtotal += resolved.price * ci.quantity;
      }
    });
    var discountPercent = this.getDiscountForCount(itemCount);
    var discount = Math.round(subtotal * (discountPercent / 100));
    return {
      itemCount: itemCount,
      subtotal: subtotal,
      discountPercent: discountPercent,
      discount: discount,
      total: subtotal - discount
    };
  };

  BundleBuilder.prototype.getDiscountForCount = function (count) {
    var d = 0;
    for (var i = 0; i < this.discountTiers.length; i++) {
      if (count >= this.discountTiers[i].minItems) d = this.discountTiers[i].discountPercent;
    }
    return d;
  };

  BundleBuilder.prototype.getNextTier = function (count) {
    for (var i = 0; i < this.discountTiers.length; i++) {
      if (count < this.discountTiers[i].minItems) return this.discountTiers[i];
    }
    return null;
  };

  BundleBuilder.prototype.getMaxTier = function () {
    if (this.discountTiers.length === 0) return null;
    return this.discountTiers[this.discountTiers.length - 1];
  };

  BundleBuilder.prototype.onCartChanged = function () {
    this.updateCartBar();
    this.updateDrawer();
    this.updateAllCards();
    this.updateExpandedPanel();
  };

  BundleBuilder.prototype.bindTabClicks = function () {
    var self = this;
    var tabsContainer = this.container.querySelector(".bundle-builder__tabs");
    if (!tabsContainer) return;
    tabsContainer.addEventListener("click", function (e) {
      var tab = e.target.closest(".bundle-builder__tab");
      if (!tab) return;
      var cat = tab.dataset.category;
      var target = document.getElementById("bb-category-" + cat.toLowerCase().replace(/\s+/g, "-"));
      if (target) {
        var offset = 70;
        var y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  };

  BundleBuilder.prototype.renderTabs = function () {
    var tabsContainer = this.container.querySelector(".bundle-builder__tabs");
    if (!tabsContainer) return;
    tabsContainer.innerHTML = "";
    var self = this;
    this.categories.forEach(function (cat) {
      var btn = el("button", { className: "bundle-builder__tab", "data-category": cat.name }, [
        el("span", { className: "bundle-builder__tab-icon", innerHTML: cat.icon || "" }),
        document.createTextNode(cat.name)
      ]);
      tabsContainer.appendChild(btn);
    });
  };

  BundleBuilder.prototype.renderCategories = function () {
    var categoriesContainer = this.container.querySelector(".bundle-builder__categories");
    if (!categoriesContainer) return;
    categoriesContainer.innerHTML = "";
    var self = this;

    this.categories.forEach(function (cat) {
      var catProducts = self.products.filter(function (p) { return p.category === cat.name; });
      if (catProducts.length === 0) return;

      var section = el("section", {
        className: "bundle-builder__category-section",
        id: "bb-category-" + cat.name.toLowerCase().replace(/\s+/g, "-")
      });

      var header = el("div", { className: "bundle-builder__category-header" }, [
        el("div", { className: "bundle-builder__category-icon", innerHTML: cat.icon || "" }),
        el("h2", { className: "bundle-builder__category-title" }, cat.name),
        el("span", { className: "bundle-builder__category-count" }, "(" + catProducts.length + " products)")
      ]);
      section.appendChild(header);

      var grid = el("div", { className: "bundle-builder__grid", "data-category": cat.name });
      catProducts.forEach(function (product) {
        grid.appendChild(self.renderCard(product));
      });
      section.appendChild(grid);
      categoriesContainer.appendChild(section);
    });
  };

  BundleBuilder.prototype.renderCard = function (product) {
    var self = this;
    var isDirect = this.isDirectAdd(product);
    var variants = product.variants || [];
    var availableCount = variants.filter(function (v) { return v.available; }).length;
    var inCart = this.getProductCartCount(product);

    var card = el("div", {
      className: "bundle-builder__card" + (isDirect ? " bundle-builder__card--direct" : "") +
        (this.expandedProductId === product.id && !isDirect ? " bundle-builder__card--expanded" : ""),
      "data-product-id": String(product.id)
    });

    var imageStyle = "background:linear-gradient(135deg," + (product.gradientFrom || "#F3F4F6") + "," + (product.gradientTo || "#D1D5DB") + ")";
    var imageDiv = el("div", { className: "bundle-builder__card-image", style: imageStyle });
    if (product.image) {
      imageDiv.appendChild(el("img", { src: product.image, alt: product.name, loading: "lazy" }));
    }

    var info = el("div", { className: "bundle-builder__card-info" }, [
      el("h3", { className: "bundle-builder__card-name" }, product.name),
      el("p", { className: "bundle-builder__card-price" }, formatMoneyShort(product.price))
    ]);

    var inner = el("div", { className: "bundle-builder__card-inner" }, [imageDiv, info]);

    if (isDirect) {
      var directVariant = variants[0];
      if (directVariant && directVariant.available) {
        var qty = this.getCartQty(directVariant.id);
        if (qty > 0) {
          inner.appendChild(self.renderQtyControls(directVariant.id, qty));
        } else {
          var addBtn = el("button", {
            className: "bundle-builder__btn bundle-builder__btn--primary bundle-builder__btn--sm",
            onClick: function (e) { e.stopPropagation(); self.addVariant(directVariant.id); }
          }, [el("span", { innerHTML: SVG.plus, style: "display:flex;width:14px;height:14px" }), document.createTextNode(" Add")]);
          inner.appendChild(addBtn);
        }
      } else {
        inner.appendChild(el("button", { className: "bundle-builder__btn bundle-builder__btn--disabled bundle-builder__btn--sm" }, "Sold Out"));
      }
    } else {
      var meta = el("div", { className: "bundle-builder__card-meta" }, [
        el("span", { className: "bundle-builder__card-scent-count" }, availableCount + " scents")
      ]);
      if (inCart > 0) {
        meta.appendChild(el("span", { className: "bundle-builder__card-badge" }, inCart + " added"));
      }
      info.appendChild(meta);

      inner.appendChild(el("div", { className: "bundle-builder__card-chevron", innerHTML: SVG.chevronDown }));

      card.addEventListener("click", function () {
        self.toggleExpand(product.id);
      });
    }

    card.appendChild(inner);
    return card;
  };

  BundleBuilder.prototype.renderQtyControls = function (variantId, qty) {
    var self = this;
    return el("div", { className: "bundle-builder__qty-controls" }, [
      el("button", {
        className: "bundle-builder__btn bundle-builder__btn--icon",
        onClick: function (e) { e.stopPropagation(); self.removeVariant(variantId); },
        innerHTML: qty === 1 ? SVG.trash : SVG.minus
      }),
      el("span", { className: "bundle-builder__qty-value" }, String(qty)),
      el("button", {
        className: "bundle-builder__btn bundle-builder__btn--icon",
        onClick: function (e) { e.stopPropagation(); self.addVariant(variantId); },
        innerHTML: SVG.plus
      })
    ]);
  };

  BundleBuilder.prototype.toggleExpand = function (productId) {
    if (this.expandedProductId === productId) {
      this.expandedProductId = null;
    } else {
      this.expandedProductId = productId;
    }
    this.rerenderGridWithPanel();
  };

  BundleBuilder.prototype.rerenderGridWithPanel = function () {
    var self = this;
    this.categories.forEach(function (cat) {
      var catProducts = self.products.filter(function (p) { return p.category === cat.name; });
      var grid = self.container.querySelector('.bundle-builder__grid[data-category="' + cat.name + '"]');
      if (!grid) return;

      grid.innerHTML = "";
      var expandedProduct = null;
      var expandedIndex = -1;

      catProducts.forEach(function (p, idx) {
        if (p.id === self.expandedProductId && !self.isDirectAdd(p)) {
          expandedProduct = p;
          expandedIndex = idx;
        }
      });

      var cols = self.getGridColumns();
      var rowEnd = expandedIndex >= 0 ? Math.min(Math.ceil((expandedIndex + 1) / cols) * cols - 1, catProducts.length - 1) : -1;

      catProducts.forEach(function (p, idx) {
        grid.appendChild(self.renderCard(p));
        if (idx === rowEnd && expandedProduct) {
          grid.appendChild(self.renderExpandedPanel(expandedProduct));
        }
      });
    });
  };

  BundleBuilder.prototype.renderExpandedPanel = function (product) {
    var self = this;
    var panel = el("div", { className: "bundle-builder__panel" });
    var inner = el("div", { className: "bundle-builder__panel-inner" });

    inner.appendChild(el("p", { className: "bundle-builder__panel-label" }, [
      document.createTextNode("Choose scents for "),
      el("strong", {}, product.name)
    ]));

    var scroll = el("div", { className: "bundle-builder__variants-scroll" });
    (product.variants || []).forEach(function (variant) {
      scroll.appendChild(self.renderVariantCard(variant, product.price));
    });
    inner.appendChild(scroll);
    panel.appendChild(inner);
    return panel;
  };

  BundleBuilder.prototype.renderVariantCard = function (variant, price) {
    var self = this;
    var qty = this.getCartQty(variant.id);
    var isAdded = qty > 0;

    var card = el("div", {
      className: "bundle-builder__variant" +
        (isAdded ? " bundle-builder__variant--added" : "") +
        (!variant.available ? " bundle-builder__variant--unavailable" : ""),
      "data-variant-id": String(variant.id)
    });

    var imageStyle = "background:linear-gradient(135deg," + (variant.gradientFrom || "#F3F4F6") + "," + (variant.gradientTo || "#D1D5DB") + ")";
    var imageDiv = el("div", { className: "bundle-builder__variant-image", style: imageStyle });

    if (variant.image) {
      imageDiv.appendChild(el("img", { src: variant.image, alt: variant.name, loading: "lazy" }));
    }

    if (variant.isNew) {
      imageDiv.appendChild(el("span", { className: "bundle-builder__variant-new" }, "New!"));
    }

    if (!variant.available) {
      var soldout = el("div", { className: "bundle-builder__variant-soldout" });
      soldout.appendChild(el("span", {}, "Out of Stock"));
      imageDiv.appendChild(soldout);
    }

    if (isAdded) {
      imageDiv.appendChild(el("span", { className: "bundle-builder__variant-qty-badge" }, String(qty)));
    }

    card.appendChild(imageDiv);

    var info = el("div", { className: "bundle-builder__variant-info" }, [
      el("h4", { className: "bundle-builder__variant-name" }, variant.name),
      el("p", { className: "bundle-builder__variant-price" }, formatMoneyShort(price))
    ]);

    if (variant.available) {
      if (isAdded) {
        info.appendChild(this.renderQtyControls(variant.id, qty));
      } else {
        info.appendChild(el("button", {
          className: "bundle-builder__btn bundle-builder__btn--sm",
          onClick: function (e) { e.stopPropagation(); self.addVariant(variant.id); }
        }, [el("span", { innerHTML: SVG.plus, style: "display:flex;width:12px;height:12px" }), document.createTextNode(" Add")]));
      }
    } else {
      info.appendChild(el("button", { className: "bundle-builder__btn bundle-builder__btn--disabled bundle-builder__btn--sm" }, "Sold Out"));
    }

    card.appendChild(info);
    return card;
  };

  BundleBuilder.prototype.updateAllCards = function () {
    this.rerenderGridWithPanel();
  };

  BundleBuilder.prototype.updateExpandedPanel = function () {
  };

  BundleBuilder.prototype.renderCartBar = function () {
    var barEl = this.container.querySelector(".bundle-builder__cart-bar");
    if (!barEl) return;
    barEl.innerHTML = "";

    var self = this;
    var totals = this.getTotals();

    var progressEl = this.buildProgressBar(totals);
    barEl.appendChild(progressEl);

    var barInner = el("div", { className: "bundle-builder__cart-bar-inner" });
    var content = el("div", { className: "bundle-builder__cart-bar-content" });

    var infoClass = "bundle-builder__cart-bar-info" + (totals.itemCount === 0 ? " bundle-builder__cart-bar-info--empty" : "");
    var info = el("div", {
      className: infoClass,
      onClick: function () { if (totals.itemCount > 0) self.openDrawer(); }
    });

    var iconWrap = el("div", { className: "bundle-builder__cart-icon", innerHTML: SVG.cart });
    if (totals.itemCount > 0) {
      iconWrap.appendChild(el("span", { className: "bundle-builder__cart-count" }, String(totals.itemCount)));
    }
    info.appendChild(iconWrap);

    var summary = el("div", { className: "bundle-builder__cart-summary" });
    if (totals.itemCount === 0) {
      summary.appendChild(el("span", { className: "bundle-builder__cart-empty" }, "Your bundle is empty"));
    } else {
      var totalsDiv = el("div", { className: "bundle-builder__cart-totals" }, [
        el("span", { className: "bundle-builder__cart-total" }, formatMoney(totals.total))
      ]);
      if (totals.discount > 0) {
        totalsDiv.appendChild(el("span", { className: "bundle-builder__cart-original" }, formatMoney(totals.subtotal)));
      }
      summary.appendChild(totalsDiv);

      if (totals.discount > 0) {
        summary.appendChild(el("p", { className: "bundle-builder__cart-savings" }, [
          el("span", { innerHTML: SVG.tag, style: "display:flex;width:12px;height:12px" }),
          document.createTextNode("You Save " + formatMoney(totals.discount) + " (" + totals.discountPercent + "% off)")
        ]));
      }
    }
    info.appendChild(summary);

    if (totals.itemCount > 0) {
      info.appendChild(el("span", { className: "bundle-builder__cart-bar-chevron", innerHTML: SVG.chevronUp }));
    }
    content.appendChild(info);

    var viewBtn = el("button", {
      className: "bundle-builder__view-btn",
      onClick: function () { if (totals.itemCount > 0) self.openDrawer(); }
    }, [
      el("span", { innerHTML: SVG.eye, style: "display:flex" }),
      document.createTextNode("View Bundle")
    ]);
    if (totals.itemCount === 0) viewBtn.disabled = true;
    content.appendChild(viewBtn);

    barInner.appendChild(content);
    barEl.appendChild(barInner);
  };

  BundleBuilder.prototype.updateCartBar = function () {
    this.renderCartBar();
  };

  BundleBuilder.prototype.buildProgressBar = function (totals) {
    var maxTier = this.getMaxTier();
    var wrap = el("div", { className: "bundle-builder__progress" });
    if (!maxTier) return wrap;

    var inner = el("div", { className: "bundle-builder__progress-inner" });
    var header = el("div", { className: "bundle-builder__progress-header" });

    var nextTier = this.getNextTier(totals.itemCount);
    var msg = el("div", { className: "bundle-builder__progress-msg" });
    msg.appendChild(el("span", { innerHTML: SVG.zap, style: "display:flex;width:14px;height:14px" }));

    if (totals.itemCount === 0) {
      msg.appendChild(document.createTextNode("Add items to start saving!"));
    } else if (!nextTier) {
      var maxMsg = el("strong", {}, "Max discount unlocked! " + totals.discountPercent + "% off");
      msg.appendChild(maxMsg);
    } else {
      var needed = nextTier.minItems - totals.itemCount;
      msg.appendChild(document.createTextNode("Add " + needed + " more for "));
      msg.appendChild(el("strong", {}, nextTier.discountPercent + "% off"));
    }
    header.appendChild(msg);

    if (totals.discountPercent > 0) {
      header.appendChild(el("span", { className: "bundle-builder__progress-badge" }, totals.discountPercent + "% off"));
    }
    inner.appendChild(header);

    var progress = Math.min((totals.itemCount / maxTier.minItems) * 100, 100);
    var track = el("div", { className: "bundle-builder__progress-track" });
    track.appendChild(el("div", { className: "bundle-builder__progress-fill", style: "width:" + progress + "%" }));

    var markers = el("div", { className: "bundle-builder__progress-markers" });
    var self = this;
    this.discountTiers.forEach(function (tier) {
      var pos = (tier.minItems / maxTier.minItems) * 100;
      markers.appendChild(el("div", { className: "bundle-builder__progress-marker", style: "left:" + pos + "%" }));
    });
    track.appendChild(markers);
    inner.appendChild(track);

    var tiers = el("div", { className: "bundle-builder__progress-tiers" });
    this.discountTiers.forEach(function (tier) {
      var reached = totals.itemCount >= tier.minItems;
      tiers.appendChild(el("span", {
        className: "bundle-builder__progress-tier" + (reached ? " bundle-builder__progress-tier--reached" : "")
      }, tier.minItems + "+ = " + tier.discountPercent + "%"));
    });
    inner.appendChild(tiers);

    wrap.appendChild(inner);
    return wrap;
  };

  BundleBuilder.prototype.renderDrawer = function () {
    var existing = this.container.querySelector(".bundle-builder__overlay");
    if (existing) existing.remove();
    var existingDrawer = this.container.querySelector(".bundle-builder__drawer");
    if (existingDrawer) existingDrawer.remove();

    var self = this;

    this.overlayEl = el("div", {
      className: "bundle-builder__overlay",
      onClick: function () { self.closeDrawer(); }
    });
    document.body.appendChild(this.overlayEl);

    this.drawerEl = el("div", { className: "bundle-builder__drawer" });
    document.body.appendChild(this.drawerEl);
    this.updateDrawer();
  };

  BundleBuilder.prototype.updateDrawer = function () {
    if (!this.drawerEl) return;
    this.drawerEl.innerHTML = "";

    var self = this;
    var totals = this.getTotals();
    var resolved = [];
    this.cartItems.forEach(function (ci) {
      var r = self.resolveCartItem(ci);
      if (r) resolved.push(r);
    });

    var header = el("div", { className: "bundle-builder__drawer-header" });
    var titleRow = el("div", { className: "bundle-builder__drawer-title" });
    var titleLeft = el("div", {});
    titleLeft.appendChild(el("h3", {}, "Your Bundle (" + totals.itemCount + " items)"));
    if (totals.discountPercent > 0) {
      titleLeft.appendChild(el("span", { className: "bundle-builder__card-badge", style: "margin-left:8px" }, totals.discountPercent + "% off"));
    }
    titleRow.appendChild(titleLeft);
    titleRow.appendChild(el("button", {
      className: "bundle-builder__drawer-close",
      onClick: function () { self.closeDrawer(); },
      innerHTML: "×"
    }));
    header.appendChild(titleRow);
    header.appendChild(el("p", { className: "bundle-builder__drawer-desc" }, "Review and manage items in your bundle"));
    this.drawerEl.appendChild(header);

    if (resolved.length === 0) {
      var emptyDiv = el("div", { className: "bundle-builder__drawer-empty" });
      emptyDiv.innerHTML = SVG.package;
      emptyDiv.appendChild(el("p", {}, "No items in your bundle yet."));
      emptyDiv.appendChild(el("p", { style: "font-size:0.75rem" }, "Browse the products above to get started!"));
      this.drawerEl.appendChild(emptyDiv);
      return;
    }

    var itemsDiv = el("div", { className: "bundle-builder__drawer-items" });
    resolved.forEach(function (item) {
      var imgStyle = "background:linear-gradient(135deg," + item.gradientFrom + "," + item.gradientTo + ")";
      var row = el("div", { className: "bundle-builder__drawer-item" }, [
        el("div", { className: "bundle-builder__drawer-item-img", style: imgStyle }),
        el("div", { className: "bundle-builder__drawer-item-info" }, [
          el("p", { className: "bundle-builder__drawer-item-name" }, item.variantName),
          el("p", { className: "bundle-builder__drawer-item-type" }, item.productName)
        ]),
        el("div", { className: "bundle-builder__drawer-item-qty" }, [
          el("button", {
            className: "bundle-builder__btn bundle-builder__btn--icon",
            onClick: function () { self.removeVariant(item.variantId); },
            innerHTML: item.quantity === 1 ? SVG.trash : SVG.minus
          }),
          el("span", {}, String(item.quantity)),
          el("button", {
            className: "bundle-builder__btn bundle-builder__btn--icon",
            onClick: function () { self.addVariant(item.variantId); },
            innerHTML: SVG.plus
          })
        ]),
        el("span", { className: "bundle-builder__drawer-item-price" }, formatMoney(item.price * item.quantity))
      ]);
      itemsDiv.appendChild(row);
    });
    this.drawerEl.appendChild(itemsDiv);

    var footer = el("div", { className: "bundle-builder__drawer-footer" });
    footer.appendChild(el("div", { className: "bundle-builder__drawer-row" }, [
      el("span", { style: "color:var(--bb-text-muted)" }, "Subtotal"),
      el("span", {}, formatMoney(totals.subtotal))
    ]));

    if (totals.discount > 0) {
      var savingsRow = el("div", { className: "bundle-builder__drawer-row bundle-builder__drawer-row--savings" });
      var savingsLabel = el("span", {});
      savingsLabel.innerHTML = SVG.tag + " Bundle Savings (" + totals.discountPercent + "%)";
      savingsRow.appendChild(savingsLabel);
      savingsRow.appendChild(el("span", {}, "-" + formatMoney(totals.discount)));
      footer.appendChild(savingsRow);
    }

    footer.appendChild(el("div", { className: "bundle-builder__drawer-divider" }));
    footer.appendChild(el("div", { className: "bundle-builder__drawer-row bundle-builder__drawer-row--total" }, [
      el("span", {}, "Total"),
      el("span", {}, formatMoney(totals.total))
    ]));

    var nextTier = this.getNextTier(totals.itemCount);
    if (nextTier) {
      var needed = nextTier.minItems - totals.itemCount;
      var upsell = el("p", { className: "bundle-builder__drawer-upsell" });
      upsell.innerHTML = SVG.arrowUp + " Add " + needed + " more item" + (needed !== 1 ? "s" : "") + " to unlock " + nextTier.discountPercent + "% off!";
      footer.appendChild(upsell);
    }

    var atcBtn = el("button", {
      className: "bundle-builder__atc-btn",
      onClick: function () { self.addToShopifyCart(); }
    }, [
      el("span", { innerHTML: SVG.cart, style: "display:flex" }),
      document.createTextNode(self.isSubmitting ? "Adding..." : "Add to Cart - " + formatMoney(totals.total))
    ]);
    if (self.isSubmitting || totals.itemCount === 0) atcBtn.disabled = true;
    footer.appendChild(atcBtn);

    this.drawerEl.appendChild(footer);
  };

  BundleBuilder.prototype.openDrawer = function () {
    this.drawerOpen = true;
    if (this.overlayEl) this.overlayEl.classList.add("bundle-builder__overlay--visible");
    if (this.drawerEl) this.drawerEl.classList.add("bundle-builder__drawer--open");
    document.body.style.overflow = "hidden";
  };

  BundleBuilder.prototype.closeDrawer = function () {
    this.drawerOpen = false;
    if (this.overlayEl) this.overlayEl.classList.remove("bundle-builder__overlay--visible");
    if (this.drawerEl) this.drawerEl.classList.remove("bundle-builder__drawer--open");
    document.body.style.overflow = "";
  };

  BundleBuilder.prototype.addToShopifyCart = function () {
    if (this.isSubmitting || this.cartItems.length === 0) return;
    this.isSubmitting = true;
    this.updateDrawer();

    var items = this.cartItems.map(function (ci) {
      return { id: ci.variantId, quantity: ci.quantity };
    });

    var self = this;

    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to add to cart");
        return res.json();
      })
      .then(function () {
        self.cartItems = [];
        self.isSubmitting = false;
        self.closeDrawer();
        self.onCartChanged();

        if (typeof window.BundleBuilderOnCartAdd === "function") {
          window.BundleBuilderOnCartAdd();
        }

        var event = new CustomEvent("bundle-builder:cart-add", { bubbles: true });
        self.container.dispatchEvent(event);
      })
      .catch(function (err) {
        self.isSubmitting = false;
        self.updateDrawer();
        console.error("BundleBuilder: cart add failed", err);
        alert("Failed to add bundle to cart. Please try again.");
      });
  };

  document.addEventListener("DOMContentLoaded", function () {
    var containers = document.querySelectorAll("[data-bundle-builder]");
    containers.forEach(function (container) {
      new BundleBuilder(container);
    });
  });

  window.BundleBuilder = BundleBuilder;
})();
