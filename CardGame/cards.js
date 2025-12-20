/* Cards database with basic behaviors for simulation
   Each card: { id, name, tier, description, onPlay(gameState, ctx), onDraw(gameState, ctx) }
   gameState contains: deck (array of ids), hand (array of ids), discard (array), board (array), player { coins, packs, health }, opponent { deck, hand, ... }
*/
(function () {
    const TIERS = {
        'Mwah': 25, 'Common': 21, 'Uncommon': 12, 'Uncommon+': 8, 'Uncommon++': 6, 'Uncommon+++': 4,
        'Rare': 5, 'Rare+': 4, 'Rare++': 3, 'Epic': 3, 'Epic+': 2, 'Legendary': 2, 'Legendary+': 1.5,
        'Supreme': 1, 'Supreme+': 0.8, 'S': 0.6, 'S+': 0.4, 'SS': 0.3, 'SSS': 0.2, 'SSSS': 0.1, 'Extra': 0.1
    };

    function noop() { }

    const CARDS = [];

    function addMany(tier, names, fnFactory) {
        names.forEach(n => { CARDS.push(Object.assign({ id: idFrom(n), name: n, tier, description: "", onPlay: noop, onDraw: noop }, fnFactory ? fnFactory(n) : {})); });
    }
    function idFrom(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }

    // Mwah Tier (25% total — 6 cards)
    addMany('Mwah', [
        'Bibi the Accident', // deletes itself randomly on draw
        'Ponk the Late', // enters field one turn late
        'Sella the Wrong Deck', // shuffles opponent’s card into your deck
        'Crumb', // only occupies hand space
        'Otto the Misclick', // forces one random action when played
        'Jax with No Plan' // increases draw count but lowers card quality
    ], (name) => {
        if (name === 'Bibi the Accident') return { description: 'On draw, 30% chance to delete itself from hand.', onDraw(g) { if (Math.random() < 0.3) { g.removeFromHand(this.id); g.messages.push(this.name + " deleted itself on draw."); } } };
        if (name === 'Ponk the Late') return { description: 'When played, arrives one turn later (schedules entry).', onPlay(g) { g.scheduleEntry(this.id); g.messages.push(this.name + " will arrive next turn."); } };
        if (name === 'Sella the Wrong Deck') return { description: "Shuffles a random opponent card into your deck on play.", onPlay(g) { if (g.opponent && g.opponent.deck.length) { const i = Math.floor(Math.random() * g.opponent.deck.length); const c = g.opponent.deck.splice(i, 1)[0]; g.deck.push(c); g.shuffleDeck(); g.messages.push(this.name + " shuffled opponent card into your deck."); } else g.messages.push(this.name + " had no opponent cards to steal."); } };
        if (name === 'Crumb') return { description: 'Occupies hand space and does nothing.', onPlay(g) { g.messages.push(this.name + " does nothing."); } };
        if (name === 'Otto the Misclick') return { description: 'When played, forces a random action (draw, discard, play random).', onPlay(g) { const acts = ['draw', 'discard', 'playRandom']; const a = acts[Math.floor(Math.random() * acts.length)]; if (a === 'draw') { g.draw(1); g.messages.push(this.name + " forced a draw."); } else if (a === 'discard') { if (g.hand.length) { const idx = Math.floor(Math.random() * g.hand.length); const c = g.hand.splice(idx, 1)[0]; g.discard.push(c); g.messages.push(this.name + " forced discard of a random card."); } } else { if (g.hand.length) { const idx = Math.floor(Math.random() * g.hand.length); const c = g.hand.splice(idx, 1)[0]; g.playCardId(c); g.messages.push(this.name + " forced play of a random card."); } } } };
        if (name === 'Jax with No Plan') return { description: 'Increases next draw count by 1 but downgrades card quality.', onPlay(g) { g.nextDrawModifier = (g.nextDrawModifier || 0) + 1; g.qualityPenalty = (g.qualityPenalty || 0) + 1; g.messages.push(this.name + " increases next draw but lowers quality."); } };
    });

    // Common Tier (21% total — 7 cards)
    addMany('Common', ['Renn the Stick-Bearer', 'Mila the Runner', 'Hob the Guard', 'Tess of Three Stones', 'Bran the Loud', 'Iris the Lookout', 'Kell the Patient'], (name) => {
        if (name === 'Mila the Runner') return { description: 'On entry, draw 1 then discard 1.', onPlay(g) { g.draw(1); if (g.hand.length) { const idx = g.hand.length - 1; const c = g.hand.splice(idx, 1)[0]; g.discard.push(c); g.messages.push(this.name + " drew then discarded."); } } };
        if (name === 'Iris the Lookout') return { description: 'Reveal top 3 cards of your deck.', onPlay(g) { const top = g.deck.slice(0, 3).map(id => g.cardName(id)); g.messages.push(this.name + " reveals: " + top.join(', ')); } };
        if (name === 'Bran the Loud') return { description: 'Buffs allies slightly, debuffs self (simulated as no-op).', onPlay(g) { g.messages.push(this.name + " buffs allies (simulated)."); } };
        if (name === 'Kell the Patient') return { description: 'Grows slowly if left on board (we simulate no-op).', onPlay(g) { g.messages.push(this.name + " sits patiently."); } };
        if (name === 'Renn the Stick-Bearer') return { description: 'Stable recyclable unit.', onPlay(g) { g.messages.push(this.name + " stands firm."); } };
        if (name === 'Hob the Guard') return { description: 'Delays damage (simulated).', onPlay(g) { g.messages.push(this.name + " delays damage (simulated)."); } };
        if (name === 'Tess of Three Stones') return { description: 'Weak damage, high consistency.', onPlay(g) { g.messages.push(this.name + " deals small consistent damage (simulated)."); } };
    });

    // Uncommon (12% total — 6 cards)
    addMany('Uncommon', ['Kala of the River', 'Dren the Spark', 'Ona the Split', 'Pyr the Ashling', 'Voss the Weight', 'Nemi the Loop'], (name) => {
        if (name === 'Kala of the River') return { description: 'Redraw with downgrade risk.', onPlay(g) { g.draw(1); if (Math.random() < 0.3) { g.messages.push(this.name + " triggered downgrade risk (simulated)."); } } };
        if (name === 'Dren the Spark') return { description: 'Random low-tier spell on play.', onPlay(g) { const spells = ['Minor Burn', 'Weak Shock']; g.messages.push(this.name + " cast " + spells[Math.floor(Math.random() * spells.length)]); } };
        if (name === 'Ona the Split') return { description: 'Duplicates weak effects unpredictably.', onPlay(g) { if (Math.random() < 0.5) { g.playLastEffectTwice(); g.messages.push(this.name + " duplicated an effect."); } else g.messages.push(this.name + " did not duplicate."); } };
        if (name === 'Pyr the Ashling') return { description: 'Gains power when cards burn (sim simulated).', onPlay(g) { g.messages.push(this.name + " grows from burn events (simulated)."); } };
        if (name === 'Voss the Weight') return { description: 'Trades hand size for defense.', onPlay(g) { if (g.hand.length > 0) { const c = g.hand.pop(); g.discard.push(c); g.messages.push(this.name + " traded a card for defense (simulated)."); } else g.messages.push(this.name + " had no hand to trade."); } };
        if (name === 'Nemi the Loop') return { description: 'Repeats last minor action.', onPlay(g) { g.repeatLastAction(); g.messages.push(this.name + " repeats last action."); } };
    });

    // Uncommon+ (8% total — 5 cards)
    addMany('Uncommon+', ['Tarn the Tracker', 'Ysil the Counter', 'Hera the Calm', 'Krov the Lean', 'Mire the Doubtful'], (name) => {
        if (name === 'Tarn the Tracker') return { description: 'Reveal or sacrifice mechanic.', onPlay(g) { if (Math.random() < 0.5) { const top = g.deck[0]; g.messages.push(this.name + " reveals " + g.cardName(top)); } else { g.discard.push(this.id); g.messages.push(this.name + " sacrificed itself."); } } };
        if (name === 'Ysil the Counter') return { description: 'Reacts to opponent randomness.', onPlay(g) { g.messages.push(this.name + " counters random opponent effects (simulated)."); } };
        if (name === 'Hera the Calm') return { description: 'Stabilizes draws at a cost.', onPlay(g) { g.stabilizeNextDraw = true; g.messages.push(this.name + " stabilizes draws (simulated)."); } };
        if (name === 'Krov the Lean') return { description: 'Benefits from small decks.', onPlay(g) { if (g.deck.length < 10) g.messages.push(this.name + " gains from small deck."); else g.messages.push(this.name + " sees no benefit."); } };
        if (name === 'Mire the Doubtful') return { description: 'Forces rerolls on both sides.', onPlay(g) { g.messages.push(this.name + " forced rerolls on both sides (simulated)."); } };
    });

    // Uncommon++ (6% total — 4 cards)
    addMany('Uncommon++', ['Eris the Blade-Dancer', 'Sarn the Edge', 'Vale the Breaker', 'Ixo the Tilted'], (name) => {
        if (name === 'Eris the Blade-Dancer') return { description: 'Discard-powered aggression.', onPlay(g) { if (g.hand.length) { const c = g.hand.pop(); g.discard.push(c); g.messages.push(this.name + " discarded to strike (simulated)."); } } };
        if (name === 'Sarn the Edge') return { description: 'Gains stats when cards vanish.', onPlay(g) { g.messages.push(this.name + " gains stats when cards vanish (simulated)."); } };
        if (name === 'Vale the Breaker') return { description: 'Converts risk into burst.', onPlay(g) { g.messages.push(this.name + " converts risk into burst (simulated)."); } };
        if (name === 'Ixo the Tilted') return { description: 'Grows stronger as odds worsen.', onPlay(g) { g.messages.push(this.name + " grows stronger as odds worsen (simulated)."); } };
    });

    // Uncommon+++ (4% total — 3 cards)
    addMany('Uncommon+++', ['Veyl the Initiate', 'Keth the Channeler', 'Rysa the Split Vein'], (name) => {
        if (name === 'Veyl the Initiate') return { description: 'Overdrawing gamble engine.', onPlay(g) { g.draw(2); g.messages.push(this.name + " causes an overdrawing gamble."); } };
        if (name === 'Keth the Channeler') return { description: 'Burns itself for spikes.', onPlay(g) { g.discard.push(this.id); g.messages.push(this.name + " burned itself for a spike."); } };
        if (name === 'Rysa the Split Vein') return { description: 'Trades health for control.', onPlay(g) { g.player.health -= 2; g.messages.push(this.name + " traded health for control."); } };
    });

    // Rare (5% total — 3 cards)
    addMany('Rare', ['Gorn Ironhide', 'Luma the Ward', 'Hark the Wall'], (name) => {
        if (name === 'Gorn Ironhide') return { description: 'Delayed damage storage.', onPlay(g) { g.messages.push(this.name + " stores delayed damage (simulated)."); } };
        if (name === 'Luma the Ward') return { description: 'Shields at future cost.', onPlay(g) { g.messages.push(this.name + " grants shield at future cost (simulated)."); } };
        if (name === 'Hark the Wall') return { description: 'Freezes board momentum.', onPlay(g) { g.messages.push(this.name + " freezes board momentum (simulated)."); } };
    });

    // Rare+ (4% total — 3 cards)
    addMany('Rare+', ['Silra the Ember Witch', 'Venn the Surge', 'Oris the Breakpoint'], (name) => {
        if (name === 'Silra the Ember Witch') return { description: 'Discard-to-damage engine.', onPlay(g) { if (g.hand.length) { const c = g.hand.pop(); g.discard.push(c); g.messages.push(this.name + " discarded to deal damage (simulated)."); } } };
        if (name === 'Venn the Surge') return { description: 'Converts luck into power.', onPlay(g) { g.messages.push(this.name + " converts luck into power (simulated)."); } };
        if (name === 'Oris the Breakpoint') return { description: 'Punishes overcommitment.', onPlay(g) { g.messages.push(this.name + " punishes overcommitment (simulated)."); } };
    });

    // Rare++ (3% total — 2 cards)
    addMany('Rare++', ['Nyx of the Silent Step', 'Zail the Inverse'], (name) => {
        if (name === 'Nyx of the Silent Step') return { description: 'Timing-based execution.', onPlay(g) { g.messages.push(this.name + " executes with timing."); } };
        if (name === 'Zail the Inverse') return { description: 'Rewards misplays sometimes.', onPlay(g) { if (Math.random() < 0.4) g.messages.push(this.name + " rewarded a misplay."); else g.messages.push(this.name + " remained inert."); } };
    });

    // Epic (3% total — 2)
    addMany('Epic', ['Thalos Stormbound', 'Eren the Cascade'], (name) => {
        if (name === 'Thalos Stormbound') return { description: 'Increases variance globally.', onPlay(g) { g.varianceGlobally = true; g.messages.push(this.name + " increased global variance (simulated)."); } };
        if (name === 'Eren the Cascade') return { description: 'Chains effects uncontrollably.', onPlay(g) { g.messages.push(this.name + " triggered cascading effects (simulated)."); } };
    });

    // Epic+ (2% total — 2)
    addMany('Epic+', ['Mireya the Blood Oracle', 'Solun the Oath-Binder'], (name) => {
        if (name === 'Mireya the Blood Oracle') return { description: 'Foresight at cost.', onPlay(g) { g.messages.push(this.name + " granted foresight at a cost (simulated)."); } };
        if (name === 'Solun the Oath-Binder') return { description: 'Locks future decisions.', onPlay(g) { g.messages.push(this.name + " locked future decisions (simulated)."); } };
    });

    // Legendary (2% total — 2)
    addMany('Legendary', ['Kael the World-Burner', 'Noxara the Unmaking'], (name) => {
        if (name === 'Kael the World-Burner') return { description: 'Mutual deck decay.', onPlay(g) { g.player.deckDecay = (g.player.deckDecay || 0) + 1; g.messages.push(this.name + " started mutual deck decay."); } };
        if (name === 'Noxara the Unmaking') return { description: 'Erases value over time.', onPlay(g) { g.messages.push(this.name + " erases value over time (simulated)."); } };
    });

    // Legendary+ (1.5% total — 1)
    addMany('Legendary+', ['Seraphine of the Final Hymn'], (name) => {
        return { description: 'Ultimate effect (simulated)', onPlay(g) { g.messages.push(this.name + " sang the final hymn (simulated)."); } };
    });

    // Supreme (1% total — 1)
    addMany('Supreme', ['Voruun, Devourer of Kings'], (name) => ({ description: 'Devours kings (simulated)', onPlay(g) { g.messages.push(this.name + " devoured kings (simulated)."); } }));
    // Supreme+ (0.8% 1)
    addMany('Supreme+', ['Astraea the Boundless Judge'], (name) => ({ description: 'Judgement (simulated)', onPlay(g) { g.messages.push(this.name + " judged the board (simulated)."); } }));
    // S (0.6%)
    addMany('S', ['Kairo the Timeless Duelist'], (name) => ({ description: 'Timeless prowess (simulated)', onPlay(g) { g.messages.push(this.name + " displayed timeless prowess."); } }));
    // S+ (0.4%)
    addMany('S+', ['Luneth the Void Saint'], (name) => ({ description: 'Void saintly effect (simulated)', onPlay(g) { g.messages.push(this.name + " invoked void saintly effects."); } }));
    // SS (0.3%)
    addMany('SS', ['Ophion the Spiral Mind'], (name) => ({ description: 'Spiral mind effects (simulated)', onPlay(g) { g.messages.push(this.name + " spiraled the mind (simulated)."); } }));
    // SSS (0.2%)
    addMany('SSS', ['Eidolon Prime'], (name) => ({ description: 'Prime eidolon (simulated)', onPlay(g) { g.messages.push(this.name + " did prime things (simulated)."); } }));
    // SSSS (0.1%)
    addMany('SSSS', ['The Black Register'], (name) => ({ description: 'Black register effect (simulated)', onPlay(g) { g.messages.push(this.name + " invoked the black register (simulated)."); } }));
    // Extra (0.1%)
    addMany('Extra', ['X, the Resonant Null'], (name) => ({ description: 'Resonant nullity (simulated)', onPlay(g) { g.messages.push(this.name + " resonated nullity (simulated)."); } }));

    // compute weights per card based on TIERS
    const tierCounts = {};
    CARDS.forEach(c => tierCounts[c.tier] = (tierCounts[c.tier] || 0) + 1);
    CARDS.forEach(c => c.weight = (TIERS[c.tier] || 0) / (tierCounts[c.tier] || 1));

    // expose
    window.CARDS = CARDS;
    window.CARD_TIERS = TIERS;
})();