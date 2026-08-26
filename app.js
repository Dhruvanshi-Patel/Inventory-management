
document.addEventListener('DOMContentLoaded', function() {
    // LocalStorage Storage Key
    var STORAGE_KEY = 'inventory_products_pure';

    // UI Element Selectors
    var searchInput = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');
    var pillButtons = document.querySelectorAll('.pill-btn');
    var viewButtons = document.querySelectorAll('.view-btn');
    var tableViewContainer = document.getElementById('tableViewContainer');
    var gridViewContainer = document.getElementById('gridViewContainer');
    var productTableBody = document.getElementById('productTableBody');
    var productGrid = document.getElementById('productGrid');
    var emptyState = document.getElementById('emptyState');
    var toastContainer = document.getElementById('toastContainer');

    // Stat Metric Cards
    var totalProductsVal = document.getElementById('totalProductsVal');
    var totalValueVal = document.getElementById('totalValueVal');
    var lowStockVal = document.getElementById('lowStockVal');
    var outOfStockVal = document.getElementById('outOfStockVal');
    var statCards = document.querySelectorAll('.stat-card');

    // Modals & Forms
    var productModal = document.getElementById('productModal');
    var deleteModal = document.getElementById('deleteModal');
    var productForm = document.getElementById('productForm');
    var btnAddProduct = document.getElementById('btnAddProduct');
    var btnResetData = document.getElementById('btnResetData');
    var btnConfirmDelete = document.getElementById('btnConfirmDelete');

    // Filter & View State
    var currentSearchQuery = '';
    var currentCategory = 'all';
    var currentStockStatus = 'all';
    var currentViewMode = 'table';
    var activeDeleteId = null;

    // Core Data Array & Map
    var productsArray = [];
    var productsMap = new Map();

    // ----------------------------------------------------
    // 1. Data Initialization & LocalStorage Helper Functions
    // ----------------------------------------------------

    function getDefaultSeedProducts() {
        return [
            { id: 1, name: 'Wireless Bluetooth Headphones', description: 'Over-ear headphones with deep bass and 20-hour battery backup.', price: 2499.00, stock_quantity: 15, category: 'Electronics' },
            { id: 2, name: 'RGB Mechanical Gaming Keyboard', description: 'Tactile switches with customizable rainbow LED backlighting.', price: 3499.00, stock_quantity: 3, category: 'Electronics' },
            { id: 3, name: 'Full HD Monitor 24 inch', description: '1080p IPS display monitor for office and gaming.', price: 8999.00, stock_quantity: 0, category: 'Electronics' },
            { id: 4, name: 'Cotton Polo T-Shirt', description: 'Breathable 100% pure cotton regular fit t-shirt.', price: 799.00, stock_quantity: 25, category: 'Apparel' },
            { id: 5, name: 'Electric Coffee Maker Machine', description: 'Automatic drip coffee brewer with keep-warm plate.', price: 1850.00, stock_quantity: 2, category: 'Home & Kitchen' },
            { id: 6, name: 'Complete Web Development Book', description: 'Beginner guide to HTML, CSS, JavaScript, PHP and SQL databases.', price: 450.00, stock_quantity: 0, category: 'Books' },
            { id: 7, name: 'Organic Roasted Coffee Beans 500g', description: 'Fresh roasted arabica coffee beans.', price: 599.00, stock_quantity: 40, category: 'Groceries' }
        ];
    }

    function loadProducts() {
        var storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            try {
                var parsed = JSON.parse(storedData); // Standard browser storage parse
                if (Array.isArray(parsed) && parsed.length > 0) {
                    productsArray = parsed;
                    syncMap();
                    return;
                }
            } catch (e) {
                console.warn('Error reading LocalStorage', e);
            }
        }
        // Load Seed Products if empty
        productsArray = getDefaultSeedProducts();
        saveProducts();
        syncMap();
    }

    function saveProducts() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productsArray));
        syncMap();
    }

    function syncMap() {
        productsMap.clear();
        for (var i = 0; i < productsArray.length; i++) {
            var item = productsArray[i];
            productsMap.set(item.id, item);
        }
    }

    // ----------------------------------------------------
    // 2. Main Render & UI Updating Functions
    // ----------------------------------------------------

    function renderUI() {
        renderMetrics();
        renderCategoryFilterOptions();

        var filteredList = getFilteredProducts();

        if (filteredList.length === 0) {
            emptyState.style.display = 'block';
            tableViewContainer.style.display = 'none';
            gridViewContainer.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        if (currentViewMode === 'table') {
            tableViewContainer.style.display = 'block';
            gridViewContainer.style.display = 'none';
            renderTable(filteredList);
        } else {
            tableViewContainer.style.display = 'none';
            gridViewContainer.style.display = 'grid';
            renderGrid(filteredList);
        }
    }

    function renderMetrics() {
        var totalCount = productsArray.length;
        var totalValuation = 0;
        var lowStockCount = 0;
        var outOfStockCount = 0;

        for (var i = 0; i < productsArray.length; i++) {
            var p = productsArray[i];
            totalValuation += (p.price * p.stock_quantity);
            if (p.stock_quantity === 0) {
                outOfStockCount++;
            } else if (p.stock_quantity <= 5) {
                lowStockCount++;
            }
        }

        totalProductsVal.textContent = totalCount;
        totalValueVal.textContent = '₹' + totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        lowStockVal.textContent = lowStockCount;
        outOfStockVal.textContent = outOfStockCount;
    }

    function renderCategoryFilterOptions() {
        var categoriesSet = new Set();
        for (var i = 0; i < productsArray.length; i++) {
            categoriesSet.add(productsArray[i].category);
        }
        var categories = Array.from(categoriesSet).sort();

        var selected = categoryFilter.value;
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        for (var j = 0; j < categories.length; j++) {
            var cat = categories[j];
            var opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            if (cat === selected) opt.selected = true;
            categoryFilter.appendChild(opt);
        }
    }

    function getFilteredProducts() {
        var result = [];

        for (var i = 0; i < productsArray.length; i++) {
            var p = productsArray[i];
            var stock = p.stock_quantity;
            var statusKey = stock === 0 ? 'outofstock' : (stock <= 5 ? 'lowstock' : 'instock');

            var isMatch = true;

            // Search filter (Name, Category, Description)
            if (currentSearchQuery !== '') {
                var query = currentSearchQuery.toLowerCase();
                var nameMatch = p.name.toLowerCase().indexOf(query) !== -1;
                var catMatch = p.category.toLowerCase().indexOf(query) !== -1;
                var descMatch = (p.description || '').toLowerCase().indexOf(query) !== -1;

                if (!nameMatch && !catMatch && !descMatch) {
                    isMatch = false;
                }
            }

            // Category filter
            if (currentCategory !== 'all' && p.category !== currentCategory) {
                isMatch = false;
            }

            // Stock status filter
            if (currentStockStatus !== 'all' && statusKey !== currentStockStatus) {
                isMatch = false;
            }

            if (isMatch) {
                result.push(p);
            }
        }

        return result;
    }

    function renderTable(productsList) {
        productTableBody.innerHTML = '';

        for (var i = 0; i < productsList.length; i++) {
            var p = productsList[i];
            var stock = p.stock_quantity;
            var badgeClass = stock === 0 ? 'badge-outofstock' : (stock <= 5 ? 'badge-lowstock' : 'badge-instock');
            var badgeText = stock === 0 ? 'Out of Stock' : (stock <= 5 ? 'Low Stock' : 'In Stock');

            var tr = document.createElement('tr');
            tr.innerHTML = 
                '<td>' +
                    '<div class="product-name-cell">' +
                        '<span class="product-title">' + escapeHtml(p.name) + '</span>' +
                    '</div>' +
                '</td>' +
                '<td><span class="card-category">' + escapeHtml(p.category) + '</span></td>' +
                '<td><span class="price-text">₹' + p.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</span></td>' +
                '<td>' +
                    '<div class="stock-adjuster">' +
                        '<button type="button" class="btn btn-secondary btn-icon-only btn-sm btn-minus" data-id="' + p.id + '"><i class="fa-solid fa-minus"></i></button>' +
                        '<span class="stock-count">' + stock + '</span>' +
                        '<button type="button" class="btn btn-secondary btn-icon-only btn-sm btn-plus" data-id="' + p.id + '"><i class="fa-solid fa-plus"></i></button>' +
                    '</div>' +
                '</td>' +
                '<td><span class="badge ' + badgeClass + '">' + badgeText + '</span></td>' +
                '<td class="actions-cell">' +
                    '<button type="button" class="btn btn-secondary btn-icon-only btn-edit" data-id="' + p.id + '" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-icon-only btn-delete" data-id="' + p.id + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
                '</td>';

            productTableBody.appendChild(tr);
        }

        attachRowEventListeners();
    }

    function renderGrid(productsList) {
        productGrid.innerHTML = '';

        for (var i = 0; i < productsList.length; i++) {
            var p = productsList[i];
            var stock = p.stock_quantity;
            var badgeClass = stock === 0 ? 'badge-outofstock' : (stock <= 5 ? 'badge-lowstock' : 'badge-instock');
            var badgeText = stock === 0 ? 'Out of Stock' : (stock <= 5 ? 'Low Stock' : 'In Stock');

            var card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = 
                '<div>' +
                    '<div class="card-header">' +
                        '<span class="card-category">' + escapeHtml(p.category) + '</span>' +
                        '<span class="badge ' + badgeClass + '">' + badgeText + '</span>' +
                    '</div>' +
                    '<h3 class="card-title">' + escapeHtml(p.name) + '</h3>' +
                    '<p class="card-desc">' + escapeHtml(p.description || 'No description.') + '</p>' +
                '</div>' +
                '<div>' +
                    '<div class="card-meta">' +
                        '<span class="price-text" style="font-size: 18px;">₹' + p.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</span>' +
                        '<div class="stock-adjuster">' +
                            '<button type="button" class="btn btn-secondary btn-icon-only btn-sm btn-minus" data-id="' + p.id + '"><i class="fa-solid fa-minus"></i></button>' +
                            '<span class="stock-count">' + stock + '</span>' +
                            '<button type="button" class="btn btn-secondary btn-icon-only btn-sm btn-plus" data-id="' + p.id + '"><i class="fa-solid fa-plus"></i></button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-footer">' +
                        '<button type="button" class="btn btn-secondary btn-sm btn-edit" data-id="' + p.id + '"><i class="fa-solid fa-pen"></i> Edit</button>' +
                        '<button type="button" class="btn btn-danger btn-sm btn-delete" data-id="' + p.id + '"><i class="fa-solid fa-trash"></i> Delete</button>' +
                    '</div>' +
                '</div>';

            productGrid.appendChild(card);
        }

        attachRowEventListeners();
    }

    // ----------------------------------------------------
    // 3. Event Handling (Add, Edit, Delete, Stock Merge)
    // ----------------------------------------------------

    function attachRowEventListeners() {
        // Stock Plus
        document.querySelectorAll('.btn-plus').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.dataset.id);
                updateStockQuantity(id, 1);
            });
        });

        // Stock Minus
        document.querySelectorAll('.btn-minus').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.dataset.id);
                updateStockQuantity(id, -1);
            });
        });

        // Edit Button
        document.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.dataset.id);
                var p = productsMap.get(id);
                if (p) {
                    document.getElementById('modalTitle').textContent = 'Edit Product';
                    document.getElementById('productId').value = p.id;
                    document.getElementById('modalProductName').value = p.name;
                    document.getElementById('modalCategorySelect').value = p.category;
                    document.getElementById('modalPrice').value = p.price;
                    document.getElementById('modalStockQuantity').value = p.stock_quantity;
                    document.getElementById('modalDescription').value = p.description || '';

                    productModal.showModal();
                }
            });
        });

        // Delete Button
        document.querySelectorAll('.btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.dataset.id);
                var p = productsMap.get(id);
                if (p) {
                    activeDeleteId = id;
                    document.getElementById('deleteProductName').textContent = p.name;
                    deleteModal.showModal();
                }
            });
        });
    }

    // Form Submit (Add / Edit with Duplicate Stock Merging)
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var idInput = document.getElementById('productId').value;
        var name = document.getElementById('modalProductName').value.trim();
        var category = document.getElementById('modalCategorySelect').value.trim();
        var price = Math.max(0, parseFloat(document.getElementById('modalPrice').value) || 0);
        var stock_quantity = Math.max(0, parseInt(document.getElementById('modalStockQuantity').value) || 0);
        var description = document.getElementById('modalDescription').value.trim();

        if (!name || !category) {
            showToast('Product name and category are required!', 'danger');
            return;
        }

        if (idInput) {
            // Edit existing product
            var editId = parseInt(idInput);
            var item = productsMap.get(editId);
            if (item) {
                item.name = name;
                item.category = category;
                item.price = price;
                item.stock_quantity = stock_quantity;
                item.description = description;
                
                saveProducts();
                renderUI();
                showToast('Product updated successfully!', 'success');
            }
        } else {
            // Add product with case-insensitive duplicate name check
            var existingItem = null;
            for (var i = 0; i < productsArray.length; i++) {
                if (productsArray[i].name.toLowerCase().trim() === name.toLowerCase()) {
                    existingItem = productsArray[i];
                    break;
                }
            }

            if (existingItem) {
                // Duplicate product found: Merge stock quantity & update price
                existingItem.stock_quantity += stock_quantity;
                if (price > 0) existingItem.price = price;
                if (description) existingItem.description = description;

                saveProducts();
                renderUI();
                showToast('Product already exists! Added ' + stock_quantity + ' units to existing stock.', 'success');
            } else {
                // New unique product
                var newId = Date.now();
                var newProduct = {
                    id: newId,
                    name: name,
                    category: category,
                    price: price,
                    stock_quantity: stock_quantity,
                    description: description
                };

                productsArray.unshift(newProduct);
                saveProducts();
                renderUI();
                showToast('New product added to inventory!', 'success');
            }
        }

        productModal.close();
    });

    // Stock Quantity +/- Helper Function
    function updateStockQuantity(id, delta) {
        var item = productsMap.get(id);
        if (item) {
            item.stock_quantity = Math.max(0, item.stock_quantity + delta);
            saveProducts();
            renderUI();
            showToast('Stock quantity updated!', 'success');
        }
    }

    // Confirm Delete Handler
    btnConfirmDelete.addEventListener('click', function() {
        if (activeDeleteId) {
            productsArray = productsArray.filter(function(p) { return p.id !== activeDeleteId; });
            saveProducts();
            renderUI();
            showToast('Product deleted from inventory.', 'warning');
            deleteModal.close();
            activeDeleteId = null;
        }
    });

    // Reset Data Handler
    if (btnResetData) {
        btnResetData.addEventListener('click', function() {
            if (confirm('Reset inventory data back to initial sample items?')) {
                localStorage.removeItem(STORAGE_KEY);
                productsArray = getDefaultSeedProducts();
                saveProducts();
                renderUI();
                showToast('Inventory reset to default sample items.', 'info');
            }
        });
    }

    // ----------------------------------------------------
    // 4. Filters & Controls Event Listeners
    // ----------------------------------------------------

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            renderUI();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function(e) {
            currentCategory = e.target.value;
            renderUI();
        });
    }

    pillButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            pillButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentStockStatus = btn.dataset.status;
            renderUI();
        });
    });

    statCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var filterTarget = card.dataset.filterTarget;
            statCards.forEach(function(c) { c.classList.remove('active-filter'); });

            if (filterTarget) {
                card.classList.add('active-filter');
                currentStockStatus = filterTarget;
                pillButtons.forEach(function(b) {
                    b.classList.toggle('active', b.dataset.status === filterTarget);
                });
            } else {
                currentStockStatus = 'all';
                pillButtons.forEach(function(b) { b.classList.toggle('active', b.dataset.status === 'all'); });
            }
            renderUI();
        });
    });

    viewButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            viewButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentViewMode = btn.dataset.view;
            renderUI();
        });
    });

    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', function() {
            document.getElementById('modalTitle').textContent = 'Add New Product';
            document.getElementById('productId').value = '';
            productForm.reset();
            productModal.showModal();
        });
    }

    document.querySelectorAll('.modal-close, .btn-cancel').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var modal = e.target.closest('dialog');
            if (modal) modal.close();
        });
    });

    // ----------------------------------------------------
    // 5. Toast Notifications & Helpers
    // ----------------------------------------------------

    function showToast(message, type) {
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + (type || 'info');
        toast.innerHTML = '<span>' + escapeHtml(message) + '</span>';

        toastContainer.appendChild(toast);

        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 300);
        }, 2500);
    }

    function escapeHtml(str) {
        return (str || '').toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Startup Initialization
    loadProducts();
    renderUI();
});
