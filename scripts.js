// Game state - Currency in D&D system (1 gold = 10 silver = 100 copper)
let playerCurrency = {
    gold: 0,
    silver: 0,
    copper: 0
};
let currentItem = null;
let currentShop = 'weapons';
let purchasedItems = [];
let soldItems = [];
let startingCurrency = { gold: 0, silver: 0, copper: 0 };

// Shop data with descriptions
const shopData = {
    weapons: {
        title: "⚔️ Weapon Shop",
        description: "Fine blades and ranged weapons for the discerning adventurer"
    },
    armory: {
        title: "🛡️ Armory",
        description: "Protective gear and shields to keep you safe in battle"
    },
    magic: {
        title: "🔮 Magic Shop",
        description: "Mystical artifacts and enchanted items of great power"
    },
    apothecary: {
        title: "🧪 Apothecary",
        description: "Healing potions and remedies for what ails you"
    },
    alchemy: {
        title: "⚗️ Alchemist",
        description: "Experimental concoctions and magical components"
    },
    blacksmith: {
        title: "🔨 Blacksmith",
        description: "Custom metalwork and equipment maintenance"
    },
    general: {
        title: "📦 General Store",
        description: "Essential supplies and adventuring gear"
    },
    tailor: {
        title: "✂️ Tailor",
        description: "Fine clothing and fabric goods for any occasion"
    },
    music: {
        title: "🎵 Music Store",
        description: "Instruments and musical accessories for bards and music lovers"
    }
};

// Store items organized by shop type
const storeItems = {
    weapons: [
        {
            name: "Sharpening Stone",
            price: { gold: 0, silver: 5, copper: 0 },
            rarity: "common",
            preview: "A simple stone used to hone an edge.",
            description: "Using this before a battle grants +1 damage for the first fight as the weapon edge is finely sharpened.",
            stats: "Consumable, 1 use"
        },
        {
            name: "Lumberjack's Handaxe",
            price: { gold: 5, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A sturdy axe favored by Birchen's lumberjacks.",
            description: "Well-balanced hatchet, good for both chopping wood and foes.",
            stats: "Melee weapon (simple handaxe)<br>Damage: 1d6 slashing<br>Properties: Light, Thrown (20/60)<br>Weight: 2 lbs"
        },
        {
            name: "Silvered Dagger",
            price: { gold: 25, silver: 0, copper: 0 },
            rarity: "uncommon",
            preview: "A dagger with a silvered edge.",
            description: "Favored by monster hunters, this dagger bypasses resistances of certain supernatural creatures.",
            stats: "Simple Melee weapon<br>Damage: 1d4 piercing<br>Properties: Finesse, Light, Thrown (20/60)<br>Weight: 1 lb"
        },
        {
            name: "Moon-Touched Shortsword",
            price: { gold: 150, silver: 0, copper: 0 },
            rarity: "uncommon",
            preview: "A faintly glowing shortsword.",
            description: "When drawn, this sword sheds dim light in a 15 ft radius. Its glow never fades.",
            stats: "Damage: 1d6 piercing<br>Properties: Light<br>Weight: 2 lbs"
        }
    ],
    armory: [
        {
            name: "Spare Shield Strap",
            price: { gold: 0, silver: 0, copper: 8 },
            rarity: "common",
            preview: "A reinforced leather strap for shields.",
            description: "If you would drop your shield due to a mishap, fumble, or similar effect, the spare strap keeps the shield in place instead. The strap then breaks and is destroyed.",
            stats: "Adventuring Gear, Consumable, 1 use"
        },
        {
            name: "Padded Armor",
            price: { gold: 5, silver: 0, copper: 0 },
            rarity: "common",
            preview: "Quilted layers of cloth and padding offering minimal protection.",
            description: "Light armor consisting of quilted layers of cloth. Provides minimal protection but is inexpensive and easy to wear. You have disadvantage on Dexterity (Stealth) checks while wearing it.",
            stats: "AC: 11 + Dex modifier<br>Weight: 8 lbs<br>Category: Light Armor<br>Stealth: Disadvantage"
        },
        {
            name: "Shield",
            price: { gold: 10, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A sturdy shield, sometimes made of wood reinforced with metal.",
            description: "While wielding a shield, you gain a +2 bonus to AC. Equipping or unequipping a shield requires an action.",
            stats: "AC Bonus: +2<br>Weight: 6 lbs<br>Category: Shield"
        },
        {
            name: "Cloak of Protection",
            price: { gold: 500, silver: 0, copper: 0 },
            rarity: "uncommon",
            preview: "A cloak shimmering faintly with protective runes.",
            description: "While wearing this cloak, you gain a +1 bonus to AC and saving throws. Requires attunement.",
            stats: "AC Bonus: +1<br>Saving Throws: +1<br>Attunement: Required"
        }
    ],
    magic: [
        {
            name: "Candle",
            price: { gold: 0, silver: 0, copper: 1 },
            rarity: "common",
            preview: "A simple wax candle.",
            description: "Burns for 1 hour, shedding bright light in a 5-foot radius and dim light for an additional 5 feet.",
            stats: "Consumable, 1 use, Weight: 0.1 lb"
        },
        {
            name: "Scroll of Light",
            price: { gold: 15, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A parchment scroll inscribed with the Light cantrip.",
            description: "This spell scroll contains the Light cantrip. You can cast the spell from the scroll without using a spell slot. Once used, the scroll is destroyed.",
            stats: "Spell: Light (Cantrip), Consumable, 1 use"
        },
        {
            name: "Driftglobe",
            price: { gold: 750, silver: 0, copper: 0 },
            rarity: "uncommon",
            preview: "A small glass orb that floats and glows.",
            description: "The driftglobe can follow its owner, providing light or casting *Daylight* once per day.",
            stats: "Light: 20 ft bright, 20 ft dim<br>Spell: Daylight 1/day"
        },
        {
            name: "Ring of Sending",
            price: { gold: 1000, silver: 0, copper: 0 }, 
            rarity: "rare",
            preview: "A simple ring inscribed with magical runes.",
            description: "While wearing this ring, you can use an action to send a short message of up to 25 words to a creature you know. The message is delivered instantly, regardless of distance, even across planes. You can use this property once per day. The ring requires attunement.",
            stats: "Charges: 1/day<br>Activation: Action<br>Range: Unlimited<br>Requires Attunement: Yes"
        }
    ],
    apothecary: [
        {
            name: "Bundle of Healing Herbs",
            price: { gold: 0, silver: 5, copper: 0 },
            rarity: "common",
            preview: "A small pouch of dried herbs.",
            description: "Restores 1 HP when chewed during a short rest.",
            stats: "Consumable, 1 use"
        },
        {
            name: "Sleep Tea",
            price: { gold: 0, silver: 8, copper: 0 },
            rarity: "common",
            preview: "A fragrant herbal tea.",
            description: "Promotes restful sleep and relieves nightmares.",
            stats: "Consumable, 1 use"
        },
        {
            name: "Potion of Minor Healing",
            price: { gold: 20, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A vial of diluted healing potion.",
            description: "Restores 1d4+2 hit points when consumed.",
            stats: "Effect: Heal 1d4+2 HP<br>Duration: Instant"
        },
        {
            name: "Potion of Greater Healing",
            price: { gold: 100, silver: 0, copper: 0 },
            rarity: "uncommon",
            preview: "A potent healing draught with golden swirls.",
            description: "Restores 4d4+4 hit points.",
            stats: "Effect: Heal 4d4+4 HP<br>Duration: Instant"
        }
    ],
    alchemy: [
        {
            name: "Stink Bomb",
            price: { gold: 0, silver: 0, copper: 9 },
            rarity: "common",
            preview: "A fragile glass vial of foul liquid.",
            description: "Creates a 10 ft cloud of unbearable odor, causing nausea (roleplay effect).",
            stats: "Consumable, 1 use"
        },
        {
            name: "Oil Flask",
            price: { gold: 0, silver: 1, copper: 0 },
            rarity: "common",
            preview: "A clay flask filled with oil.",
            description: "Can be used as lamp fuel or thrown for minor fire damage.",
            stats: "Consumable, 1 use"
        },
        {
            name: "Smoke Bomb",
            price: { gold: 1, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A small clay sphere filled with powdered chemicals.",
            description: "As an action, you can throw this bomb up to 20 feet. Upon impact, it creates a cloud of smoke in a 20-foot radius, heavily obscuring the area. The smoke lasts until the start of your next turn. The bomb is consumed after use.",
            stats: "Consumable, 1 use, Action to throw, Area: 20 ft radius, Duration: 1 round"
        },
        {
            name: "Oil of Slipperiness",
            price: { gold: 250, silver: 0, copper: 0 },
            rarity: "uncommon",
            preview: "A slick black vial of enchanted oil.",
            description: "Replicates the *Grease* spell, can coat armor or ground.",
            stats: "Duration: 8 hours"
        }
    ],
    blacksmith: [
        {
            name: "Iron Nails (10 count)",
            price: { gold: 0, silver: 0, copper: 5 },
            rarity: "common",
            preview: "A bundle of sturdy iron nails.",
            description: "Useful for traps, barricades, or repairs.",
            stats: "Utility item"
        },
        {
            name: "Reinforced Rope (50 ft)",
            price: { gold: 1, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A tough hemp rope with metal wire woven in.",
            description: "Harder to cut or break than normal rope.",
            stats: "DC 18 to break"
        },
        {
            name: "Silvered Arrowheads (5)",
            price: { gold: 25, silver: 0, copper: 0 },
            rarity: "uncommon",
            preview: "A small bundle of silver-tipped arrows.",
            description: "Bypasses resistances of supernatural creatures.",
            stats: "Damage: Normal arrows, but silvered"
        },
        {
            name: "Full Plate Armor",
            price: { gold: 1000, silver: 0, copper: 0 }, 
            rarity: "common",
            preview: "A heavy suit of steel armor covering the entire body.",
            description: "This full plate armor provides excellent protection but is heavy and requires strength to wear effectively. It imposes disadvantage on Stealth checks due to its weight.",
            stats: "Armor Type: Heavy Armor<br>AC: 18<br>Strength Requirement: 15<br>Stealth: Disadvantage<br>Weight: 65 lbs<br>Nonmagical"
        }
    ],
    general: [
        {
            name: "Chalk Stick (3 uses)",
            price: { gold: 0, silver: 0, copper: 2 },
            rarity: "common",
            preview: "A small stick of chalk.",
            description: "Useful for marking walls, leaving signals, or maps.",
            stats: "Consumable, 3 uses"
        },
        {
            name: "Lantern with Oil (3 uses)",
            price: { gold: 0, silver: 8, copper: 0 },
            rarity: "common",
            preview: "A small metal lantern with oil.",
            description: "Provides bright light for 20 ft, dim light for 20 ft for 6 hours.",
            stats: "Consumable oil (3 uses)"
        },
        {
            name: "Fishing Rod",
            price: { gold: 1, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A simple rod for catching fish in rivers or lakes.",
            description: "This basic fishing rod allows you to catch fish for food or trade. Using it does not require a skill check, but time and patience are needed.",
            stats: "Weight: 4 lbs<br>Category: Adventuring Gear<br>Nonmagical"
        },
        {
            name: "Fishing Net",
            price: { gold: 5, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A rope net used by local fishermen.",
            description: "Can be used to restrain targets or catch fish.",
            stats: "Special attack to restrain"
        },
        {
            name: "Tent (2-person)",
            price: { gold: 5, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A basic canvas tent for two people.",
            description: "A simple canvas tent that accommodates two people. Provides basic shelter from weather.",
            stats: "Capacity: 2 people<br>Weight: 20 lbs<br>Nonmagical"
        },
        {
            name: "Rope, Silk (50 ft)",
            price: { gold: 100, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A strong, smooth rope made of braided silk.",
            description: "This 50-foot length of silk rope is lighter and stronger than hemp rope. It can support up to 500 pounds of weight.",
            stats: "Weight: 5 lbs<br>Strength: Holds 500 lbs<br>Material: Silk, Nonmagical"
        }
    ],
    tailor: [
        {
            name: "Color-Changing Ribbon",
            price: { gold: 0, silver: 5, copper: 0 },
            rarity: "common",
            preview: "A decorative ribbon that shifts between colors.",
            description: "Can switch between two colors at will.",
            stats: "Utility, cosmetic"
        },
        {
            name: "Traveler's Cloak",
            price: { gold: 12, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A weatherproof cloak.",
            description: "Protects from rain and keeps its wearer warm.",
            stats: "Durable, light"
        },
        {
            name: "Traveler's Boots (High-Quality)",
            price: { gold: 20, silver: 0, copper: 0 },
            rarity: "common",
            preview: "Sturdy leather boots reinforced for long journeys.",
            description: "These boots are crafted from soft, durable leather and reinforced at the soles and ankles. They are comfortable for long-distance travel, protecting the feet from rough terrain and reducing fatigue.",
            stats: "Weight: 2 lbs<br>Nonmagical, Durable, Comfortable for long travel"
        },
        {
            name: "Hat of Disguise",
            price: { gold: 700, silver: 0, copper: 0 },
            rarity: "uncommon",
            preview: "A stylish hat with enchantments.",
            description: "Allows wearer to change appearance as per *Disguise Self*.",
            stats: "Requires attunement"
        }
    ],
    music: [
        {
            name: "Carved Whistle",
            price: { gold: 0, silver: 0, copper: 3 },
            rarity: "common",
            preview: "A small whistle carved from bone.",
            description: "Mimics the sound of a local birdcall.",
            stats: "Utility, 1 use per round"
        },
        {
            name: "Traveler's Flute",
            price: { gold: 5, silver: 0, copper: 0 },
            rarity: "common",
            preview: "A simple flute of ash wood.",
            description: "Favored by wandering minstrels.",
            stats: "Instrument"
        },
        {
            name: "Songbook of Ezhulian Ballads",
            price: { gold: 1, silver: 5, copper: 0 },
            rarity: "common",
            preview: "A book of Ezhulian sailor songs and tales.",
            description: "Grants advantage on History checks about sailor history of a Ezhulian sea.",
            stats: "Utility item"
        },
        {
            name: "Fochlucan Bandore",
            price: { gold: 500, silver: 0, copper: 0 }, 
            rarity: "uncommon",
            preview: "A finely crafted lute adorned with minor magical runes.",
            description: "While holding this bandore, you can use it as a spellcasting focus. It allows you to cast certain spells (like *Charm Person* and *Cure Wounds*) from the instrument's table. Requires attunement by a bard.",
            stats: "Magical: Yes<br>Attunement: Bard only<br>Spells: Cast from DMG table for instrument<br>Charges: Recharge daily"
        }
    ]
};

// Currency conversion functions
function convertToCopper(currency) {
    return currency.gold * 100 + currency.silver * 10 + currency.copper;
}

function convertFromCopper(totalCopper) {
    const gold = Math.floor(totalCopper / 100);
    const silver = Math.floor((totalCopper % 100) / 10);
    const copper = totalCopper % 10;
    return { gold, silver, copper };
}

function formatPrice(price) {
    const parts = [];
    if (price.gold > 0) parts.push(`${price.gold} gold`);
    if (price.silver > 0) parts.push(`${price.silver} silver`);
    if (price.copper > 0) parts.push(`${price.copper} copper`);
    return parts.join(', ') || '0 copper';
}

function canAfford(price) {
    const playerTotal = convertToCopper(playerCurrency);
    const priceTotal = convertToCopper(price);
    return playerTotal >= priceTotal;
}

function calculateChange(price) {
    const playerTotal = convertToCopper(playerCurrency);
    const priceTotal = convertToCopper(price);
    
    if (playerTotal < priceTotal) {
        return null; // Cannot afford
    }
    
    const changeInCopper = playerTotal - priceTotal;
    return convertFromCopper(changeInCopper);
}

// Shop navigation
function switchShop(shopType) {
    currentShop = shopType;
    
    // Update active navigation button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-shop="${shopType}"]`).classList.add('active');
    
    // Update shop header
    document.getElementById('shop-title').textContent = shopData[shopType].title;
    document.getElementById('shop-description').textContent = shopData[shopType].description;
    
    // Reload store items
    initializeStore();
}

// Initialize store
function initializeStore() {
    const storeGrid = document.getElementById('store-grid');
    storeGrid.innerHTML = '';

    const items = storeItems[currentShop] || [];
    
    items.forEach((item, index) => {
        const itemCard = createItemCard(item, index);
        storeGrid.appendChild(itemCard);
    });

    updateCurrencyDisplay();
}

// Create item card
function createItemCard(item, index) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.onclick = () => openModal(item);

    card.innerHTML = `
        <div class="item-name">${item.name}</div>
        <div class="item-price">💰 ${formatPrice(item.price)}</div>
        <div class="item-rarity ${item.rarity}">${item.rarity.toUpperCase()}</div>
        <div class="item-preview">${item.preview}</div>
    `;

    return card;
}

// Modal scroll indicator management
function updateScrollIndicators(modalElement) {
    const isScrollable = modalElement.scrollHeight > modalElement.clientHeight;
    const isScrolledDown = modalElement.scrollTop > 20;
    const isScrolledToBottom = modalElement.scrollTop + modalElement.clientHeight >= modalElement.scrollHeight - 20;
    
    modalElement.classList.toggle('scrollable', isScrollable && !isScrolledToBottom);
    modalElement.classList.toggle('scrolled-down', isScrolledDown);
    modalElement.classList.toggle('scrolled-bottom', isScrolledToBottom);
}

// Modal functions
function openModal(item) {
    currentItem = item;
    
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-price').innerHTML = `💰 ${formatPrice(item.price)}`;
    document.getElementById('modal-rarity').textContent = item.rarity.toUpperCase();
    document.getElementById('modal-rarity').className = `item-rarity ${item.rarity}`;
    document.getElementById('modal-description').textContent = item.description;
    document.getElementById('modal-stats').innerHTML = `
        <div class="stats-title">📊 Item Statistics</div>
        ${item.stats}
    `;

    // Update payment section
    updatePaymentSection(item);

    const modal = document.getElementById('item-modal');
    modal.style.display = 'block';
    
    // Setup scroll indicators
    const modalContent = modal.querySelector('.modal-content');
    setTimeout(() => {
        updateScrollIndicators(modalContent);
        
        // Add scroll listener
        modalContent.addEventListener('scroll', () => updateScrollIndicators(modalContent));
    }, 100);
}

function updatePaymentSection(item) {
    const priceBreakdown = document.getElementById('price-breakdown');
    const changeCalculator = document.getElementById('change-calculator');
    const buyButton = document.getElementById('buy-button');
    
    // Show price breakdown
    let breakdown = '<div class="price-line"><span>Item Price:</span><span>' + formatPrice(item.price) + '</span></div>';
    breakdown += '<div class="price-line"><span>Your Currency:</span><span>' + formatPrice(playerCurrency) + '</span></div>';
    breakdown += '<div class="price-line total"><span>Total Cost:</span><span>' + formatPrice(item.price) + '</span></div>';
    
    if (canAfford(item.price)) {
        const change = calculateChange(item.price);
        if (change.gold > 0 || change.silver > 0 || change.copper > 0) {
            changeCalculator.style.display = 'block';
            document.getElementById('change-display').innerHTML = `
                <div class="change-line">💰 Gold: ${change.gold}</div>
                <div class="change-line">🥈 Silver: ${change.silver}</div>
                <div class="change-line">🥉 Copper: ${change.copper}</div>
            `;
        } else {
            changeCalculator.style.display = 'block';
            document.getElementById('change-display').innerHTML = '<div class="change-line">Exact change - no change needed!</div>';
        }
        
        buyButton.disabled = false;
        buyButton.textContent = `Purchase for ${formatPrice(item.price)}`;
    } else {
        changeCalculator.style.display = 'block';
        const needed = convertToCopper(item.price) - convertToCopper(playerCurrency);
        const neededCurrency = convertFromCopper(needed);
        
        document.getElementById('change-display').innerHTML = `
            <div class="insufficient-funds">
                Insufficient funds! You need ${formatPrice(neededCurrency)} more.
            </div>
        `;
        
        buyButton.disabled = true;
        buyButton.textContent = 'Insufficient funds';
    }
    
    priceBreakdown.innerHTML = breakdown;
}

function closeModal() {
    document.getElementById('item-modal').style.display = 'none';
    currentItem = null;
}

// Purchase function
// Purchase function (REPLACE the existing one)
function purchaseItem() {
    if (!currentItem || !canAfford(currentItem.price)) {
        showNotification('Insufficient funds!', 'error');
        return;
    }

    // Add to purchased items list
    purchasedItems.push({
        name: currentItem.name,
        price: { ...currentItem.price }
    });

    // Calculate new currency after purchase
    const playerTotal = convertToCopper(playerCurrency);
    const priceTotal = convertToCopper(currentItem.price);
    const newTotal = playerTotal - priceTotal;
    playerCurrency = convertFromCopper(newTotal);
    
    updateCurrencyDisplay();
    showNotification(`Successfully purchased ${currentItem.name}!`, 'success');
    closeModal();
}

// Update currency display
function updateCurrencyDisplay() {
    document.getElementById('gold-amount').textContent = playerCurrency.gold;
    document.getElementById('silver-amount').textContent = playerCurrency.silver;
    document.getElementById('copper-amount').textContent = playerCurrency.copper;
}

// Currency setup functions
function setupPlayerCurrency() {
    const gold = parseInt(document.getElementById('input-gold').value) || 0;
    const silver = parseInt(document.getElementById('input-silver').value) || 0;
    const copper = parseInt(document.getElementById('input-copper').value) || 0;
    
    playerCurrency = { gold, silver, copper };
    startingCurrency = { gold, silver, copper }; // Track starting amount
    updateCurrencyDisplay();
    
    document.getElementById('currency-setup-modal').style.display = 'none';
    initializeStore();
}

// Setup currency modal scroll indicators
function setupCurrencyModal() {
    const modal = document.getElementById('currency-setup-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    setTimeout(() => {
        updateScrollIndicators(modalContent);
        
        // Add scroll listener
        modalContent.addEventListener('scroll', () => updateScrollIndicators(modalContent));
    }, 100);
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Setup currency first
    document.getElementById('start-shopping').onclick = setupPlayerCurrency;
    
    // Setup currency modal scroll indicators
    setupCurrencyModal();

     document.getElementById('sell-btn').onclick = openSellModal;
    document.getElementById('finish-shopping-btn').onclick = showShoppingSummary;
    
    // Navigation event listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const shopType = this.getAttribute('data-shop');
            switchShop(shopType);
        });
    });
    
    // Other event listeners
    document.querySelector('.close').onclick = closeModal;
    document.getElementById('buy-button').onclick = purchaseItem;

    window.onclick = function(event) {
        const modal = document.getElementById('item-modal');
        const setupModal = document.getElementById('currency-setup-modal');
        if (event.target === modal) {
            closeModal();
        }
        // Don't allow closing setup modal by clicking outside
    };

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    // Allow Enter key in currency setup
    document.querySelectorAll('.currency-input').forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                setupPlayerCurrency();
            }
        });
    });
});

// Sell item functions
function openSellModal() {
    const modal = document.createElement('div');
    modal.id = 'sell-modal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeSellModal()">&times;</span>
            <div class="modal-header">
                <h2 class="modal-title">💰 Sell Item</h2>
            </div>
            <div class="modal-description">
                What would you like to sell?
            </div>
            <div class="sell-input-group">
                <label for="sell-item-name">Item Name:</label>
                <input type="text" id="sell-item-name" class="sell-input" placeholder="Enter item name">
            </div>
            <div class="currency-input-section">
                <div class="currency-input-group">
                    <label for="sell-gold">💰 Gold Received:</label>
                    <input type="number" id="sell-gold" min="0" value="0" class="currency-input">
                </div>
                <div class="currency-input-group">
                    <label for="sell-silver">🥈 Silver Received:</label>
                    <input type="number" id="sell-silver" min="0" value="0" class="currency-input">
                </div>
                <div class="currency-input-group">
                    <label for="sell-copper">🥉 Copper Received:</label>
                    <input type="number" id="sell-copper" min="0" value="0" class="currency-input">
                </div>
            </div>
            <button class="buy-btn" onclick="sellItem()">Sell Item</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeSellModal() {
    const modal = document.getElementById('sell-modal');
    if (modal) {
        modal.remove();
    }
}

function sellItem() {
    const itemName = document.getElementById('sell-item-name').value.trim();
    const gold = parseInt(document.getElementById('sell-gold').value) || 0;
    const silver = parseInt(document.getElementById('sell-silver').value) || 0;
    const copper = parseInt(document.getElementById('sell-copper').value) || 0;
    
    if (!itemName) {
        showNotification('Please enter an item name!', 'error');
        return;
    }
    
    if (gold === 0 && silver === 0 && copper === 0) {
        showNotification('Please enter a sale amount!', 'error');
        return;
    }
    
    // Add to sold items list
    const salePrice = { gold, silver, copper };
    soldItems.push({
        name: itemName,
        price: salePrice
    });
    
    // Add currency to player
    playerCurrency.gold += gold;
    playerCurrency.silver += silver;
    playerCurrency.copper += copper;
    
    updateCurrencyDisplay();
    showNotification(`Successfully sold ${itemName}!`, 'success');
    closeSellModal();
}

// Shopping summary functions
function showShoppingSummary() {
    const modal = document.createElement('div');
    modal.id = 'summary-modal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    // Calculate totals
    let totalSpent = { gold: 0, silver: 0, copper: 0 };
    let totalEarned = { gold: 0, silver: 0, copper: 0 };
    
    purchasedItems.forEach(item => {
        totalSpent.gold += item.price.gold;
        totalSpent.silver += item.price.silver;
        totalSpent.copper += item.price.copper;
    });
    
    soldItems.forEach(item => {
        totalEarned.gold += item.price.gold;
        totalEarned.silver += item.price.silver;
        totalEarned.copper += item.price.copper;
    });
    
    // Create purchased items list
    let purchasedList = '';
    if (purchasedItems.length > 0) {
        purchasedItems.forEach((item, index) => {
            purchasedList += `
                <div class="summary-item clickable-item" onclick="showPurchasedItemDetail(${index})">
                    <span>${item.name}</span>
                    <span>${formatPrice(item.price)}</span>
                    <span class="click-hint">👁️</span>
                </div>
            `;
        });
    } else {
        purchasedList = '<div class="summary-item"><span>No items purchased</span><span>-</span></div>';
    }
    
    // Create sold items list
    let soldList = '';
    if (soldItems.length > 0) {
        soldItems.forEach(item => {
            soldList += `
                <div class="summary-item">
                    <span>${item.name}</span>
                    <span>${formatPrice(item.price)}</span>
                </div>
            `;
        });
    } else {
        soldList = '<div class="summary-item"><span>No items sold</span><span>-</span></div>';
    }
    
    // Calculate net change
    const startingTotal = convertToCopper(startingCurrency);
    const currentTotal = convertToCopper(playerCurrency);
    const netChange = currentTotal - startingTotal;
    const netCurrency = convertFromCopper(Math.abs(netChange));
    const netString = netChange >= 0 ? 
        `+${formatPrice(netCurrency)}` : 
        `-${formatPrice(netCurrency)}`;
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeSummaryModal()">&times;</span>
            <div class="modal-header">
                <h2 class="modal-title">📋 Shopping Summary</h2>
            </div>
            
            <div class="summary-section">
                <div class="summary-title">🛍️ Items Purchased</div>
                <div class="summary-list">
                    ${purchasedList}
                </div>
                <div class="summary-total">Total Spent: ${formatPrice(totalSpent)}</div>
            </div>
            
            <div class="summary-section">
                <div class="summary-title">💰 Items Sold</div>
                <div class="summary-list">
                    ${soldList}
                </div>
                <div class="summary-total">Total Earned: ${formatPrice(totalEarned)}</div>
            </div>
            
            <div class="summary-section">
                <div class="summary-title">💼 Final Summary</div>
                <div class="summary-item">
                    <span>Starting Currency:</span>
                    <span>${formatPrice(startingCurrency)}</span>
                </div>
                
                <div class="summary-item">
                <span>Current Currency:</span>
                    <span><strong>${formatPrice(playerCurrency)}</strong></span>
                    </div>
            </div>
            
            <button class="buy-btn" onclick="resetShopping()">New Shopping Session</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeSummaryModal() {
    const modal = document.getElementById('summary-modal');
    if (modal) {
        modal.remove();
    }
}

function resetShopping() {
    purchasedItems = [];
    soldItems = [];
    startingCurrency = { ...playerCurrency };
    closeSummaryModal();
    showNotification('New shopping session started!', 'success');
}

// Show detailed view of purchased item
function showPurchasedItemDetail(itemIndex) {
    const purchasedItem = purchasedItems[itemIndex];
    if (!purchasedItem) return;
    
    // Find the original item data from store
    let originalItem = null;
    for (let shopType in storeItems) {
        const found = storeItems[shopType].find(item => item.name === purchasedItem.name);
        if (found) {
            originalItem = found;
            break;
        }
    }
    
    // If we can't find the original item, create a basic one
    if (!originalItem) {
        originalItem = {
            name: purchasedItem.name,
            price: purchasedItem.price,
            rarity: "unknown",
            preview: "Previously purchased item",
            description: "This item was purchased earlier in your shopping session.",
            stats: "No additional details available"
        };
    }
    
    // Create detail modal
    const detailModal = document.createElement('div');
    detailModal.id = 'item-detail-modal';
    detailModal.className = 'modal';
    detailModal.style.display = 'block';
    detailModal.style.zIndex = '2100'; // Higher than summary modal
    
    detailModal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeItemDetailModal()">&times;</span>
            <div class="modal-header">
                <h2 class="modal-title">${originalItem.name}</h2>
                <div class="modal-price">💰 ${formatPrice(originalItem.price)}</div>
                <div class="item-rarity ${originalItem.rarity}">${originalItem.rarity.toUpperCase()}</div>
                <div class="purchased-badge">✅ PURCHASED</div>
            </div>
            <div class="modal-description">${originalItem.description}</div>
            <div class="stats-section">
                <div class="stats-title">📊 Item Statistics</div>
                ${originalItem.stats}
            </div>
            <button class="buy-btn" onclick="closeItemDetailModal()" style="background: linear-gradient(145deg, #6b5c43, #8a7850);">
                Close Details
            </button>
        </div>
    `;
    
    document.body.appendChild(detailModal);
}

function closeItemDetailModal() {
    const modal = document.getElementById('item-detail-modal');
    if (modal) {
        modal.remove();
    }
}