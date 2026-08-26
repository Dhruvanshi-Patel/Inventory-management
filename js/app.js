/**
 * Simple Procedural UI Controller
 * Beginner Vanilla JavaScript (No ES6 Classes, No JSON)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get Elements
    var searchInput = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');
    var pillButtons = document.querySelectorAll('.pill-btn');
    var viewButtons = document.querySelectorAll('.view-btn');
    var tableViewContainer = document.getElementById('tableViewContainer');
    var gridViewContainer = document.getElementById('gridViewContainer');
    var emptyState = document.getElementById('emptyState');
    var statCards = document.querySelectorAll('.stat-card');

    // Modals
    var productModal = document.getElementById('productModal');
    var deleteModal = document.getElementById('deleteModal');
    var productForm = document.getElementById('productForm');
    var btnAddProduct = document.getElementById('btnAddProduct');

    // State Variables
    var currentSearchQuery = '';
    var currentCategory = 'all';
    var currentStockStatus = 'all';
    var currentViewMode = 'table';

    // Store DOM elements in Array for fast filtering
    var productRows = Array.from(document.querySelectorAll('tr[data-id]'));
    var productCards = Array.from(document.querySelectorAll('.product-card[data-id]'));

    // Search Input Event
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            filterProducts();
        });
    }

    // Category Dropdown Event
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function(e) {
            currentCategory = e.target.value;
            filterProducts();
        });
    }

    // Status Filter Pills Event
    pillButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            pillButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentStockStatus = btn.dataset.status;
            filterProducts();
        });
    });

    // Stat Cards Quick Filter Event
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
            filterProducts();
        });
    });

    // View Mode Toggle (Table vs Grid)
    viewButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            viewButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentViewMode = btn.dataset.view;
            if (currentViewMode === 'table') {
                tableViewContainer.style.display = 'block';
                gridViewContainer.style.display = 'none';
            } else {
                tableViewContainer.style.display = 'none';
                gridViewContainer.style.display = 'grid';
            }
        });
    });

    // Open Add Modal
    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', function() {
            document.getElementById('modalTitle').textContent = 'Add New Product';
            document.getElementById('formAction').value = 'add';
            document.getElementById('productId').value = '';
            productForm.reset();
            productModal.showModal();
        });
    }

    // Open Edit Modal
    document.querySelectorAll('.btn-edit').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var d = btn.dataset;
            document.getElementById('modalTitle').textContent = 'Edit Product';
            document.getElementById('formAction').value = 'edit';
            document.getElementById('productId').value = d.id;
            document.getElementById('modalProductName').value = d.name;
            document.getElementById('modalCategorySelect').value = d.category;
            document.getElementById('modalPrice').value = d.price;
            document.getElementById('modalStockQuantity').value = d.stock_quantity;
            document.getElementById('modalDescription').value = d.description;

            productModal.showModal();
        });
    });

    // Open Delete Modal
    document.querySelectorAll('.btn-delete').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.dataset.id;
            var name = btn.dataset.name;
            document.getElementById('deleteProductId').value = id;
            document.getElementById('deleteProductName').textContent = name;
            deleteModal.showModal();
        });
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var modal = e.target.closest('dialog');
            if (modal) modal.close();
        });
    });

    // Main Filter Function
    function filterProducts() {
        var visibleCount = 0;

        productRows.forEach(function(row) {
            var id = row.dataset.id;
            var name = row.dataset.name || '';
            var category = row.dataset.category || '';
            var description = row.dataset.description || '';
            var status = row.dataset.status || '';
            var card = document.querySelector('.product-card[data-id="' + id + '"]');

            var isVisible = true;

            // 1. Search Query
            if (currentSearchQuery !== '') {
                var matches = name.indexOf(currentSearchQuery) !== -1 ||
                              category.toLowerCase().indexOf(currentSearchQuery) !== -1 ||
                              description.indexOf(currentSearchQuery) !== -1;
                if (!matches) isVisible = false;
            }

            // 2. Category Filter
            if (currentCategory !== 'all' && category !== currentCategory) {
                isVisible = false;
            }

            // 3. Stock Status Filter
            if (currentStockStatus !== 'all' && status !== currentStockStatus) {
                isVisible = false;
            }

            // Toggle visibility
            row.style.display = isVisible ? '' : 'none';
            if (card) card.style.display = isVisible ? '' : 'none';

            if (isVisible) visibleCount++;
        });

        // Toggle Empty State
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
            tableViewContainer.style.display = 'none';
            gridViewContainer.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            if (currentViewMode === 'table') {
                tableViewContainer.style.display = 'block';
                gridViewContainer.style.display = 'none';
            } else {
                tableViewContainer.style.display = 'none';
                gridViewContainer.style.display = 'grid';
            }
        }
    }

    // Auto-hide Toast Notification
    var toast = document.querySelector('.toast');
    if (toast) {
        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }
});
