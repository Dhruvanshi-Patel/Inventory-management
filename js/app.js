/**
 * Main Application UI Controller
 * Inventory Management System (Pure JS, No JSON)
 */

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const pillButtons = document.querySelectorAll('.pill-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    const tableViewContainer = document.getElementById('tableViewContainer');
    const gridViewContainer = document.getElementById('gridViewContainer');
    const emptyState = document.getElementById('emptyState');

    // Stat Metric Cards
    const statCards = document.querySelectorAll('.stat-card');

    // Modals
    const productModal = document.getElementById('productModal');
    const deleteModal = document.getElementById('deleteModal');
    
    // Forms
    const productForm = document.getElementById('productForm');
    
    // Header Buttons
    const btnAddProduct = document.getElementById('btnAddProduct');

    // State Variables
    let currentFilterState = {
        searchQuery: '',
        category: 'all',
        stockStatus: 'all'
    };
    let currentViewMode = 'table';

    // Store DOM elements in Map & Array data structures for fast client-side searching
    const productElementsMap = new Map();
    
    document.querySelectorAll('tr[data-id]').forEach(row => {
        const id = row.dataset.id;
        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        
        productElementsMap.set(id, {
            id: id,
            name: row.dataset.name || '',
            sku: row.dataset.sku || '',
            category: row.dataset.category || '',
            description: row.dataset.description || '',
            status: row.dataset.status || 'instock',
            tableRow: row,
            gridCard: card
        });
    });

    // Search Input Event
    let searchTimer;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                currentFilterState.searchQuery = e.target.value.toLowerCase().trim();
                applyClientFilters();
            }, 100);
        });
    }

    // Category Filter Event
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentFilterState.category = e.target.value;
            applyClientFilters();
        });
    }

    // Status Filter Pills
    pillButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            pillButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilterState.stockStatus = btn.dataset.status;
            applyClientFilters();
        });
    });

    // Stat Cards Quick Filter
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const filterTarget = card.dataset.filterTarget;
            statCards.forEach(c => c.classList.remove('active-filter'));
            
            if (filterTarget) {
                card.classList.add('active-filter');
                currentFilterState.stockStatus = filterTarget;
                pillButtons.forEach(b => {
                    b.classList.toggle('active', b.dataset.status === filterTarget);
                });
            } else {
                currentFilterState.stockStatus = 'all';
                pillButtons.forEach(b => b.classList.toggle('active', b.dataset.status === 'all'));
            }
            applyClientFilters();
        });
    });

    // View Mode Switcher
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
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

    // Open Add Product Modal
    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Add New Product';
            document.getElementById('formAction').value = 'add';
            document.getElementById('productId').value = '';
            productForm.reset();
            productModal.showModal();
        });
    }

    // Open Edit Product Modal
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const d = btn.dataset;
            document.getElementById('modalTitle').textContent = 'Edit Product';
            document.getElementById('formAction').value = 'edit';
            document.getElementById('productId').value = d.id;
            document.getElementById('modalProductName').value = d.name;
            document.getElementById('modalCategorySelect').value = d.category;
            document.getElementById('modalPrice').value = d.price;
            document.getElementById('modalStock').value = d.stock;
            document.getElementById('modalSku').value = d.sku;
            document.getElementById('modalDescription').value = d.description;

            productModal.showModal();
        });
    });

    // Open Delete Confirmation Modal
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            document.getElementById('deleteProductId').value = id;
            document.getElementById('deleteProductName').textContent = name;
            deleteModal.showModal();
        });
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('dialog');
            if (modal) modal.close();
        });
    });

    /**
     * Client-Side Search and Filter using Array methods
     */
    function applyClientFilters() {
        const itemsArr = Array.from(productElementsMap.values());
        let visibleCount = 0;

        itemsArr.forEach(item => {
            let isVisible = true;

            // Search Filter
            if (currentFilterState.searchQuery !== '') {
                const q = currentFilterState.searchQuery;
                const matches = item.name.includes(q) ||
                                item.sku.includes(q) ||
                                item.category.toLowerCase().includes(q) ||
                                item.description.includes(q);
                if (!matches) isVisible = false;
            }

            // Category Filter
            if (currentFilterState.category !== 'all' && item.category !== currentFilterState.category) {
                isVisible = false;
            }

            // Stock Status Filter
            if (currentFilterState.stockStatus !== 'all' && item.status !== currentFilterState.stockStatus) {
                isVisible = false;
            }

            // Toggle Visibility
            if (item.tableRow) item.tableRow.style.display = isVisible ? '' : 'none';
            if (item.gridCard) item.gridCard.style.display = isVisible ? '' : 'none';

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
    const toast = document.querySelector('.toast');
    if (toast) {
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
