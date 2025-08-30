// 🐾 貓咪罐罐 & 乾乾紀錄 - Web Application
// 使用 localStorage 進行本地資料存儲

class CatFoodApp {
    constructor() {
        this.cats = this.loadData('cats', []);
        this.foods = this.loadData('foods', []);
        this.meals = this.loadData('meals', []);
        this.editingId = null;
        
        this.init();
    }
    
    init() {
        // 初始化日期時間輸入為現在
        document.getElementById('meal-date').value = this.getCurrentDateTime();
        
        // 綁定表單事件
        this.bindEvents();
        
        // 載入初始資料
        this.loadInitialData();
        
        // 更新所有顯示
        this.updateAllDisplays();
    }
    
    bindEvents() {
        // 貓咪表單
        document.getElementById('cat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCat();
        });
        
        // 食物表單
        document.getElementById('food-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFood();
        });
        
        // 餵食表單
        document.getElementById('meal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMeal();
        });
    }
    
    // 🗄️ 資料管理
    loadData(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(`catfood_${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`載入 ${key} 資料失敗:`, error);
            return defaultValue;
        }
    }
    
    saveData(key, data) {
        try {
            localStorage.setItem(`catfood_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error(`儲存 ${key} 資料失敗:`, error);
            this.showNotification('儲存失敗！', 'error');
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getCurrentDateTime() {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    }
    
    // 🐱 貓咪管理
    saveCat() {
        const name = document.getElementById('cat-name').value.trim();
        const birthday = document.getElementById('cat-birthday').value;
        
        if (!name) {
            this.showNotification('請輸入貓咪名稱！', 'error');
            return;
        }
        
        const catData = {
            id: this.editingId || this.generateId(),
            name,
            birthday: birthday || null,
            createdAt: this.editingId ? this.cats.find(c => c.id === this.editingId).createdAt : new Date().toISOString()
        };
        
        if (this.editingId) {
            const index = this.cats.findIndex(c => c.id === this.editingId);
            this.cats[index] = catData;
            this.showNotification('貓咪資料已更新！', 'success');
        } else {
            this.cats.push(catData);
            this.showNotification('新貓咪已新增！', 'success');
        }
        
        this.saveData('cats', this.cats);
        this.updateAllDisplays();
        this.hideModal('cat-modal');
        this.resetCatForm();
    }
    
    deleteCat(id) {
        if (confirm('確定要刪除這隻貓咪嗎？相關的餵食記錄也會一併刪除。')) {
            this.cats = this.cats.filter(c => c.id !== id);
            this.meals = this.meals.filter(m => m.catId !== id);
            
            this.saveData('cats', this.cats);
            this.saveData('meals', this.meals);
            
            this.updateAllDisplays();
            this.showNotification('貓咪資料已刪除！', 'success');
        }
    }
    
    editCat(id) {
        const cat = this.cats.find(c => c.id === id);
        if (cat) {
            this.editingId = id;
            document.getElementById('cat-name').value = cat.name;
            document.getElementById('cat-birthday').value = cat.birthday || '';
            this.showModal('cat-modal');
        }
    }
    
    resetCatForm() {
        this.editingId = null;
        document.getElementById('cat-form').reset();
    }
    
    // 🍽️ 食物管理
    saveFood() {
        const name = document.getElementById('food-name').value.trim();
        const brand = document.getElementById('food-brand').value.trim();
        const type = document.getElementById('food-type').value;
        const unit = document.getElementById('food-unit').value;
        const stock = parseFloat(document.getElementById('food-stock').value) || 0;
        const alert = parseFloat(document.getElementById('food-alert').value) || 5;
        const notes = document.getElementById('food-notes').value.trim();
        
        if (!name || !type || !unit) {
            this.showNotification('請填寫必要欄位！', 'error');
            return;
        }
        
        const foodData = {
            id: this.editingId || this.generateId(),
            name,
            brand: brand || null,
            type,
            unit,
            stock,
            alertQty: alert,
            notes: notes || null,
            createdAt: this.editingId ? this.foods.find(f => f.id === this.editingId).createdAt : new Date().toISOString()
        };
        
        if (this.editingId) {
            const index = this.foods.findIndex(f => f.id === this.editingId);
            this.foods[index] = foodData;
            this.showNotification('食物資料已更新！', 'success');
        } else {
            this.foods.push(foodData);
            this.showNotification('新食物已新增！', 'success');
        }
        
        this.saveData('foods', this.foods);
        this.updateAllDisplays();
        this.hideModal('food-modal');
        this.resetFoodForm();
    }
    
    deleteFood(id) {
        if (confirm('確定要刪除這個食物嗎？相關的餵食記錄也會一併刪除。')) {
            this.foods = this.foods.filter(f => f.id !== id);
            this.meals = this.meals.filter(m => m.foodId !== id);
            
            this.saveData('foods', this.foods);
            this.saveData('meals', this.meals);
            
            this.updateAllDisplays();
            this.showNotification('食物資料已刪除！', 'success');
        }
    }
    
    editFood(id) {
        const food = this.foods.find(f => f.id === id);
        if (food) {
            this.editingId = id;
            document.getElementById('food-name').value = food.name;
            document.getElementById('food-brand').value = food.brand || '';
            document.getElementById('food-type').value = food.type;
            document.getElementById('food-unit').value = food.unit;
            document.getElementById('food-stock').value = food.stock;
            document.getElementById('food-alert').value = food.alertQty;
            document.getElementById('food-notes').value = food.notes || '';
            this.showModal('food-modal');
        }
    }
    
    resetFoodForm() {
        this.editingId = null;
        document.getElementById('food-form').reset();
        document.getElementById('food-stock').value = '0';
        document.getElementById('food-alert').value = '5';
    }
    
    // 📝 餵食記錄管理
    saveMeal() {
        const catId = document.getElementById('meal-cat').value;
        const foodId = document.getElementById('meal-food').value;
        const date = document.getElementById('meal-date').value;
        const amount = parseFloat(document.getElementById('meal-amount').value) || 0;
        const eaten = document.getElementById('meal-eaten').value;
        const rating = document.getElementById('meal-rating').value;
        const notes = document.getElementById('meal-notes').value.trim();
        
        if (!catId || !foodId || !date || !eaten || !rating) {
            this.showNotification('請填寫必要欄位！', 'error');
            return;
        }
        
        const mealData = {
            id: this.generateId(),
            catId,
            foodId,
            date,
            amount,
            eaten,
            rating,
            notes: notes || null,
            createdAt: new Date().toISOString()
        };
        
        this.meals.push(mealData);
        
        // 自動扣除庫存
        this.consumeStock(foodId, amount, eaten);
        
        this.saveData('meals', this.meals);
        this.updateAllDisplays();
        this.hideModal('meal-modal');
        this.resetMealForm();
        
        this.showNotification('餵食記錄已新增！', 'success');
    }
    
    deleteMeal(id) {
        if (confirm('確定要刪除這筆餵食記錄嗎？')) {
            this.meals = this.meals.filter(m => m.id !== id);
            this.saveData('meals', this.meals);
            this.updateAllDisplays();
            this.showNotification('餵食記錄已刪除！', 'success');
        }
    }
    
    resetMealForm() {
        document.getElementById('meal-form').reset();
        document.getElementById('meal-date').value = this.getCurrentDateTime();
    }
    
    // 📦 庫存管理
    consumeStock(foodId, amount, eaten) {
        const food = this.foods.find(f => f.id === foodId);
        if (!food) return;
        
        let consumedAmount = 0;
        
        if (eaten === 'refused') {
            // 拒絕不吃，不消耗庫存
            return;
        }
        
        // 計算實際消耗量
        const eatenRatio = this.getEatenRatio(eaten);
        
        if (food.unit === 'g') {
            consumedAmount = amount * eatenRatio;
        } else if (food.unit === 'can') {
            // 罐頭預設消耗 1 罐
            consumedAmount = 1 * eatenRatio;
        }
        
        // 更新庫存
        food.stock = Math.max(0, food.stock - consumedAmount);
        this.saveData('foods', this.foods);
    }
    
    getEatenRatio(eaten) {
        switch (eaten) {
            case 'all': return 1.0;
            case 'half': return 0.5;
            case 'quarter': return 0.25;
            case 'refused': return 0;
            default: return 1.0;
        }
    }
    
    quickAdjustStock() {
        const foodId = document.getElementById('quick-adjust-food').value;
        const amount = parseFloat(document.getElementById('quick-adjust-amount').value);
        
        if (!foodId) {
            this.showNotification('請選擇食物！', 'error');
            return;
        }
        
        if (isNaN(amount) || amount === 0) {
            this.showNotification('請輸入有效的調整數量！', 'error');
            return;
        }
        
        const food = this.foods.find(f => f.id === foodId);
        if (food) {
            food.stock = Math.max(0, food.stock + amount);
            this.saveData('foods', this.foods);
            this.updateAllDisplays();
            
            const action = amount > 0 ? '增加' : '減少';
            this.showNotification(`庫存已${action} ${Math.abs(amount)} ${food.unit === 'can' ? '罐' : '公克'}！`, 'success');
            
            // 清空表單
            document.getElementById('quick-adjust-amount').value = '';
        }
    }
    
    // 📊 統計與分析
    getStats() {
        const lowStockFoods = this.foods.filter(f => f.stock <= f.alertQty);
        const last7DaysMeals = this.meals.filter(m => {
            const mealDate = new Date(m.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return mealDate >= weekAgo;
        });
        
        return {
            totalCats: this.cats.length,
            totalFoods: this.foods.length,
            totalMeals: this.meals.length,
            lowStockCount: lowStockFoods.length,
            last7DaysMeals: last7DaysMeals.length
        };
    }
    
    getPopularFoods(limit = 3) {
        const foodStats = {};
        
        // 計算每個食物的評分統計
        this.meals.forEach(meal => {
            if (!foodStats[meal.foodId]) {
                foodStats[meal.foodId] = { total: 0, love: 0 };
            }
            foodStats[meal.foodId].total++;
            if (meal.rating === 'love') {
                foodStats[meal.foodId].love++;
            }
        });
        
        // 計算喜愛率並排序
        const rankedFoods = Object.entries(foodStats)
            .map(([foodId, stats]) => {
                const food = this.foods.find(f => f.id === foodId);
                const loveRate = stats.total > 0 ? (stats.love / stats.total) * 100 : 0;
                return { food, loveRate, total: stats.total };
            })
            .filter(item => item.food)
            .sort((a, b) => {
                if (a.loveRate === b.loveRate) {
                    return b.total - a.total; // 相同喜愛率時，總次數多的排前面
                }
                return b.loveRate - a.loveRate;
            })
            .slice(0, limit);
        
        return rankedFoods;
    }
    
    getLowStockFoods() {
        return this.foods
            .filter(f => f.stock <= f.alertQty)
            .sort((a, b) => a.stock - b.stock);
    }
    
    // 🎨 UI 更新
    updateAllDisplays() {
        this.updateStats();
        this.updateCatsList();
        this.updateFoodsList();
        this.updateMealsList();
        this.updateInventoryList();
        this.updatePopularFoods();
        this.updateLowStockFoods();
        this.updateSelects();
    }
    
    updateStats() {
        const stats = this.getStats();
        document.getElementById('total-cats').textContent = stats.totalCats;
        document.getElementById('total-foods').textContent = stats.totalFoods;
        document.getElementById('total-meals').textContent = stats.totalMeals;
        document.getElementById('low-stock-count').textContent = stats.lowStockCount;
    }
    
    updateCatsList() {
        const container = document.getElementById('cats-list');
        
        if (this.cats.length === 0) {
            container.innerHTML = '<div class="item"><div class="item-info"><p>還沒有貓咪資料，請先新增貓咪</p></div></div>';
            return;
        }
        
        container.innerHTML = this.cats.map(cat => `
            <div class="item">
                <div class="item-info">
                    <h4>🐱 ${cat.name}</h4>
                    <p>${cat.birthday ? `生日：${cat.birthday}` : '未設定生日'}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary btn-small" onclick="app.editCat('${cat.id}')">編輯</button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteCat('${cat.id}')">刪除</button>
                </div>
            </div>
        `).join('');
    }
    
    updateFoodsList() {
        const container = document.getElementById('foods-list');
        
        if (this.foods.length === 0) {
            container.innerHTML = '<div class="item"><div class="item-info"><p>還沒有食物資料，請先新增食物</p></div></div>';
            return;
        }
        
        container.innerHTML = this.foods.map(food => {
            const stockStatus = food.stock <= 0 ? 'out-of-stock' : 
                              food.stock <= food.alertQty ? 'low-stock' : '';
            const typeEmoji = food.type === 'wet' ? '🥫' : '🍖';
            const unitText = food.unit === 'can' ? '罐' : '公克';
            
            return `
                <div class="item">
                    <div class="item-info">
                        <h4>${typeEmoji} ${food.brand ? food.brand + ' ' : ''}${food.name}</h4>
                        <p class="${stockStatus}">庫存：${food.stock} ${unitText} ${stockStatus ? '⚠️' : ''}</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-secondary btn-small" onclick="app.editFood('${food.id}')">編輯</button>
                        <button class="btn btn-danger btn-small" onclick="app.deleteFood('${food.id}')">刪除</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateMealsList() {
        const container = document.getElementById('meals-list');
        
        if (this.meals.length === 0) {
            container.innerHTML = '<div class="item"><div class="item-info"><p>還沒有餵食記錄，請先新增記錄</p></div></div>';
            return;
        }
        
        // 按日期排序，最新的在前面
        const sortedMeals = [...this.meals].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = sortedMeals.map(meal => {
            const cat = this.cats.find(c => c.id === meal.catId);
            const food = this.foods.find(f => f.id === meal.foodId);
            const date = new Date(meal.date).toLocaleString('zh-TW');
            
            const eatenEmoji = {
                'all': '✅ 全吃完',
                'half': '🟡 吃一半', 
                'quarter': '🟠 一點點',
                'refused': '❌ 拒絕'
            }[meal.eaten] || meal.eaten;
            
            const ratingEmoji = {
                'love': '❤️ 很愛',
                'ok': '😊 還可以',
                'nope': '😒 不喜歡'
            }[meal.rating] || meal.rating;
            
            return `
                <div class="item">
                    <div class="item-info">
                        <h4>🍽️ ${cat?.name || '未知貓咪'} ← ${food?.name || '未知食物'}</h4>
                        <p>${date} | ${meal.amount}g | ${eatenEmoji} | ${ratingEmoji}</p>
                        ${meal.notes ? `<p style="font-style: italic; color: #94a3b8;">💭 ${meal.notes}</p>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-danger btn-small" onclick="app.deleteMeal('${meal.id}')">刪除</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateInventoryList() {
        const container = document.getElementById('inventory-list');
        
        if (this.foods.length === 0) {
            container.innerHTML = '<div class="item"><div class="item-info"><p>還沒有食物資料</p></div></div>';
            return;
        }
        
        container.innerHTML = this.foods.map(food => {
            const stockStatus = food.stock <= 0 ? 'out-of-stock' : 
                              food.stock <= food.alertQty ? 'low-stock' : '';
            const typeEmoji = food.type === 'wet' ? '🥫' : '🍖';
            const unitText = food.unit === 'can' ? '罐' : '公克';
            
            return `
                <div class="item">
                    <div class="item-info">
                        <h4>${typeEmoji} ${food.name}</h4>
                        <p class="${stockStatus}">
                            ${food.stock} / ${food.alertQty} ${unitText}
                            ${stockStatus === 'out-of-stock' ? '🚨 缺貨' : stockStatus === 'low-stock' ? '⚠️ 不足' : '✅ 充足'}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updatePopularFoods() {
        const container = document.getElementById('popular-foods');
        const popularFoods = this.getPopularFoods();
        
        if (popularFoods.length === 0) {
            container.innerHTML = '<div class="item"><div class="item-info"><p>暫無資料，需要更多餵食記錄</p></div></div>';
            return;
        }
        
        container.innerHTML = popularFoods.map((item, index) => `
            <div class="item">
                <div class="item-info">
                    <h4>🏆 ${index + 1}. ${item.food.name}</h4>
                    <p>❤️ ${item.loveRate.toFixed(0)}% 喜愛率 | 🍽️ ${item.total} 次餵食</p>
                </div>
            </div>
        `).join('');
    }
    
    updateLowStockFoods() {
        const container = document.getElementById('low-stock-foods');
        const lowStockFoods = this.getLowStockFoods();
        
        if (lowStockFoods.length === 0) {
            container.innerHTML = '<div class="item"><div class="item-info"><p>庫存充足，沒有警示</p></div></div>';
            return;
        }
        
        container.innerHTML = lowStockFoods.map(food => {
            const unitText = food.unit === 'can' ? '罐' : '公克';
            const quickAddAmount = food.unit === 'can' ? 6 : 500;
            
            return `
                <div class="item">
                    <div class="item-info">
                        <h4>⚠️ ${food.name}</h4>
                        <p class="low-stock">剩餘 ${food.stock} ${unitText}</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-primary btn-small" onclick="app.quickAdd('${food.id}', ${quickAddAmount})">
                            +${quickAddAmount}${food.unit === 'can' ? '罐' : 'g'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateSelects() {
        // 更新餵食記錄的選擇器
        const catSelect = document.getElementById('meal-cat');
        const foodSelect = document.getElementById('meal-food');
        const quickFoodSelect = document.getElementById('quick-adjust-food');
        
        catSelect.innerHTML = '<option value="">請選擇貓咪</option>' + 
            this.cats.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        
        const foodOptions = this.foods.map(food => 
            `<option value="${food.id}">${food.name} (${food.unit === 'can' ? '罐' : '公克'})</option>`
        ).join('');
        
        foodSelect.innerHTML = '<option value="">請選擇食物</option>' + foodOptions;
        quickFoodSelect.innerHTML = '<option value="">請選擇食物</option>' + foodOptions;
    }
    
    // 🚀 快速操作
    quickAdd(foodId, amount) {
        const food = this.foods.find(f => f.id === foodId);
        if (food) {
            food.stock += amount;
            this.saveData('foods', this.foods);
            this.updateAllDisplays();
            
            const unitText = food.unit === 'can' ? '罐' : '公克';
            this.showNotification(`${food.name} 已增加 ${amount} ${unitText}！`, 'success');
        }
    }
    
    // 🎨 UI 控制
    showTab(tabName) {
        // 隱藏所有分頁內容
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 移除所有分頁按鈕的 active 類別
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 顯示選中的分頁
        document.getElementById(tabName).classList.add('active');
        
        // 高亮選中的分頁按鈕
        event.target.classList.add('active');
    }
    
    showModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }
    
    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
        this.resetForms();
    }
    
    resetForms() {
        this.editingId = null;
        document.querySelectorAll('form').forEach(form => form.reset());
        document.getElementById('meal-date').value = this.getCurrentDateTime();
        document.getElementById('food-stock').value = '0';
        document.getElementById('food-alert').value = '5';
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.marginBottom = '0.5rem';
        
        const container = document.getElementById('notifications');
        container.appendChild(notification);
        
        // 3秒後自動移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // 🎲 初始化範例資料
    loadInitialData() {
        // 如果是第一次使用，載入範例資料
        if (this.cats.length === 0 && this.foods.length === 0 && this.meals.length === 0) {
            this.loadSampleData();
        }
    }
    
    loadSampleData() {
        // 範例貓咪
        this.cats = [
            { id: 'cat1', name: '咪咪', birthday: '2020-03-15', createdAt: new Date().toISOString() },
            { id: 'cat2', name: '小白', birthday: '2019-07-22', createdAt: new Date().toISOString() }
        ];
        
        // 範例食物
        this.foods = [
            { id: 'food1', name: '幼母貓', brand: '皇家', type: 'wet', unit: 'can', stock: 12, alertQty: 5, notes: null, createdAt: new Date().toISOString() },
            { id: 'food2', name: '成貓配方', brand: '希爾思', type: 'wet', unit: 'can', stock: 3, alertQty: 5, notes: null, createdAt: new Date().toISOString() },
            { id: 'food3', name: '無穀乾糧', brand: '愛肯拿', type: 'dry', unit: 'g', stock: 800, alertQty: 200, notes: '主食乾糧', createdAt: new Date().toISOString() }
        ];
        
        // 範例餵食記錄
        const now = new Date();
        this.meals = [
            {
                id: 'meal1',
                catId: 'cat1',
                foodId: 'food1',
                date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                amount: 85,
                eaten: 'all',
                rating: 'love',
                notes: '很喜歡這個口味',
                createdAt: new Date().toISOString()
            },
            {
                id: 'meal2',
                catId: 'cat2',
                foodId: 'food2',
                date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                amount: 80,
                eaten: 'half',
                rating: 'ok',
                notes: null,
                createdAt: new Date().toISOString()
            }
        ];
        
        // 儲存範例資料
        this.saveData('cats', this.cats);
        this.saveData('foods', this.foods);
        this.saveData('meals', this.meals);
        
        this.showNotification('已載入範例資料，您可以開始使用了！', 'success');
    }
    
    // 🗑️ 清除所有資料
    clearAllData() {
        if (confirm('確定要清除所有資料嗎？此操作無法復原！')) {
            localStorage.removeItem('catfood_cats');
            localStorage.removeItem('catfood_foods');
            localStorage.removeItem('catfood_meals');
            
            this.cats = [];
            this.foods = [];
            this.meals = [];
            
            this.updateAllDisplays();
            this.showNotification('所有資料已清除！', 'success');
        }
    }
    
    // 📤 匯出資料
    exportData() {
        const data = {
            cats: this.cats,
            foods: this.foods,
            meals: this.meals,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `貓咪記錄_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        this.showNotification('資料已匯出下載！', 'success');
    }
}

// 🎯 全域函數
function showTab(tabName) {
    app.showTab(tabName);
}

function showModal(modalId) {
    app.showModal(modalId);
}

function hideModal(modalId) {
    app.hideModal(modalId);
}

function quickAdjustStock() {
    app.quickAdjustStock();
}

// 🚀 初始化應用
const app = new CatFoodApp();

// 開發者控制台快捷方式
console.log('🐾 貓咪罐罐 & 乾乾紀錄 已載入！');
console.log('可用命令：');
console.log('- app.exportData() // 匯出資料');
console.log('- app.clearAllData() // 清除所有資料');
console.log('- app.loadSampleData() // 重新載入範例資料');
