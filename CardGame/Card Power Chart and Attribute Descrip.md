# Card Power Chart and Attribute Description

## Attribute Description

**Power** is the overall combat rating of a card. It does not directly participate in calculations but is used for matchmaking, AI threat evaluation, and rarity justification. A higher Power value means the card is expected to dominate lower tiers without needing optimal play.

**Light Attack** represents fast, low-commitment strikes. These are designed for early turns, chip damage, and finishing blows. Mana cost here is intentionally low to allow repeated usage even by weaker cards.

**Normal Attack** is the main damage source. It balances damage and Mana efficiency and is what most turns revolve around. If a card cannot sustain Normal Attacks, it is not viable in extended combat.

**Special Attack** defines identity and threat. These attacks are powerful, expensive, and often decisive. Once Mana cost crosses 90, backlash effects trigger automatically. These include self-damage, stat decay, cooldown lock, or permanent resource loss depending on card tier.

**Normal Defense** is reactive mitigation. It reduces incoming damage at a reasonable Mana cost and is meant to be sustainable across multiple turns.

**Hard Defense** is heavy mitigation. It is costly, situational, and intended to stop burst damage or lethal blows. At higher tiers, abusing Hard Defense drains Mana aggressively and forces risk management.

**Life** is raw survivability. It does not regenerate unless explicitly stated by card effects. Cards with high Life but poor Mana efficiency are meant to stall, not win.

## Stat Format

The stat format below is shown in a concise table layout (same as the Power Chart).

| Rarity     | Card                     | Power | Light ATK (Mana) | Normal ATK (Mana) |   Special ATK (Mana) | Normal DEF (Mana) | Hard DEF (Mana) |      Life |
| ---------- | ------------------------ | ----: | ---------------: | ----------------: | -------------------: | ----------------: | --------------: | --------: |
| Common     | Gladiator                |   120 |           18 (5) |            28 (8) |                    – |            22 (6) |          30 (9) |       160 |
| Common     | Bandits                  |   110 |           20 (5) |            26 (7) |              34 (10) |            18 (5) |          24 (8) |       140 |
| Common     | Cannon                   |   130 |           14 (4) |           40 (10) |                    – |            15 (5) |          20 (7) |       120 |
| Common     | Guillotine               |   125 |           16 (5) |            36 (9) |              48 (10) |            14 (4) |          22 (7) |       130 |
| Common     | Poison                   |   115 |           12 (4) |            24 (6) |              42 (10) |            16 (5) |          20 (7) |       135 |
| Common     | Bomb                     |   140 |           10 (3) |           50 (10) |              65 (10) |            10 (4) |          15 (6) |       100 |
| Common     | Spearman                 |   118 |           22 (5) |            30 (8) |                    – |            20 (6) |          26 (8) |       150 |
| Common     | Shield Bearer            |   122 |           14 (4) |            22 (7) |                    – |            28 (7) |         36 (10) |       180 |
| Common     | Sling Archer             |   112 |           24 (5) |            26 (7) |                    – |            16 (5) |          22 (7) |       140 |
| Common     | Foot Soldier             |   116 |           18 (5) |            28 (8) |                    – |            20 (6) |          28 (8) |       155 |
| Common     | Scout                    |   105 |           26 (5) |            24 (7) |                    – |            14 (4) |          20 (7) |       130 |
| Common     | Torch Unit               |   120 |           20 (5) |            30 (8) |              40 (10) |            18 (5) |          24 (8) |       145 |
| -------    | ---------------          | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Common+    | Knight                   |   160 |           24 (8) |           36 (10) |                    – |            30 (8) |         42 (10) |       200 |
| Common+    | Joker                    |   150 |           26 (8) |            32 (9) |              50 (12) |            22 (7) |          30 (9) |       180 |
| Common+    | Orc                      |   170 |           22 (7) |           44 (10) |              56 (12) |            26 (8) |         38 (10) |       220 |
| Common+    | Elvion                   |   165 |           28 (8) |            34 (9) |              52 (12) |            24 (7) |          34 (9) |       190 |
| Common+    | Crossbow Knight          |   168 |           30 (8) |           40 (10) |                    – |            26 (8) |         36 (10) |       210 |
| Common+    | War Drummer              |   158 |           18 (7) |            30 (9) |              48 (12) |            24 (7) |          32 (9) |       195 |
| Common+    | Shadow Thief             |   155 |           34 (8) |            28 (9) |              54 (12) |            20 (6) |          28 (8) |       170 |
| Common+    | Flame Adept              |   162 |           26 (8) |            32 (9) |              60 (12) |            22 (7) |          30 (9) |       185 |
| --------   | -----------              | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Uncommon   | Trio Knight              |   220 |          30 (12) |           44 (15) |              60 (18) |           36 (14) |         50 (18) |       280 |
| Uncommon   | Agela                    |   230 |          28 (12) |           48 (16) |              70 (20) |           34 (14) |         46 (18) |       300 |
| Uncommon   | Mune                     |   250 |          26 (12) |           52 (18) |              76 (22) |           42 (16) |         60 (20) |       340 |
| Uncommon   | Iota                     |   235 |          30 (12) |           46 (16) |              72 (20) |           32 (14) |         48 (18) |       310 |
| Uncommon   | Scith                    |   240 |          32 (12) |           50 (17) |              74 (21) |           34 (14) |         52 (19) |       320 |
| Uncommon   | Rune Archer              |   225 |          36 (12) |           44 (15) |              68 (20) |           30 (13) |         44 (17) |       290 |
| Uncommon   | War Cleric               |   245 |          26 (12) |           46 (16) |              78 (22) |           40 (15) |         58 (19) |       330 |
| Uncommon   | Stone Golem              |   260 |          20 (12) |           48 (18) |                    – |           50 (16) |         70 (22) |       380 |
| ---------  | -------------            | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Uncommon+  | Iron Knight              |   280 |          34 (15) |           56 (18) |              80 (24) |           48 (16) |         70 (22) |       380 |
| Uncommon+  | Iron Vanguard            |   290 |          36 (15) |           60 (18) |              84 (24) |           52 (17) |         76 (23) |       400 |
| Uncommon+  | Steel Reaper             |   275 |          40 (15) |           58 (18) |              88 (25) |           42 (15) |         64 (22) |       360 |
| Uncommon+  | Bastion Guard            |   300 |          28 (14) |           54 (18) |                    – |           60 (18) |         88 (26) |       420 |
| ------     | ----------------         | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Rare       | Trio Iron Knight         |   340 |          40 (18) |           64 (22) |              92 (30) |           56 (20) |         84 (28) |       460 |
| Rare       | HU9                      |   330 |          44 (18) |           60 (22) |             100 (32) |           50 (20) |         76 (26) |       440 |
| Rare       | Phantom Duelist          |   345 |          48 (18) |           62 (22) |             110 (34) |           48 (19) |         72 (26) |       420 |
| Rare       | Void Sniper              |   335 |          52 (18) |           58 (22) |             120 (36) |           44 (18) |         68 (25) |       400 |
| Rare       | Blood Alchemist          |   350 |          42 (18) |           66 (22) |             130 (38) |           52 (20) |         78 (28) |       450 |
| ------     | ------------------       | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Rare+      | High Guard Knight        |   390 |          42 (20) |           70 (24) |             110 (36) |           64 (22) |         96 (30) |       520 |
| Rare+      | Royal Executioner        |   400 |          48 (20) |           74 (24) |             140 (40) |           58 (22) |         90 (30) |       500 |
| Rare+      | Spellbreaker Capt.       |   410 |          44 (20) |           72 (24) |             135 (38) |           66 (22) |        100 (32) |       540 |
| ------     | ----------------         | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Epic       | Legion Knight            |   470 |          50 (25) |           82 (30) |             130 (40) |           76 (26) |        120 (38) |       650 |
| Epic       | Orion the Hero           |   500 |          54 (25) |           88 (32) |             145 (45) |           70 (26) |        110 (36) |       620 |
| Epic       | Orc Lord                 |   520 |          48 (24) |           96 (34) |             150 (48) |           80 (28) |        130 (40) |       700 |
| Epic       | Sunblade Paladin         |   510 |          56 (25) |           90 (32) |             160 (46) |           78 (28) |        125 (38) |       680 |
| Epic       | Abyss Warlord            |   530 |          52 (26) |          100 (34) |             170 (48) |           82 (30) |        135 (42) |       720 |
| ------     | ----------------         | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Epic+      | Legion General           |   600 |          60 (30) |          110 (38) |             170 (55) |           90 (32) |        150 (48) |       820 |
| Epic+      | Void Marshal             |   620 |          64 (30) |          115 (38) |             190 (60) |           88 (32) |        145 (46) |       800 |
| Epic+      | Grand Inquisitor         |   610 |          62 (30) |          112 (38) |             185 (58) |           92 (34) |        155 (50) |       830 |
| ---------  | ------------------------ | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Legendary  | Academia                 |   720 |          68 (40) |          130 (55) |             190 (80) |          110 (45) |        170 (70) |       950 |
| Legendary  | Oximo (Mountain Dragon)  |   780 |          72 (42) |          150 (60) |             210 (85) |          130 (50) |        200 (75) |      1100 |
| Legendary  | Nephyus (Sea Dragon)     |   760 |          78 (42) |          140 (58) |             205 (82) |          120 (48) |        185 (72) |      1020 |
| Legendary  | Hereda (Forest Dragon)   |   750 |          80 (40) |          135 (56) |             200 (80) |          125 (48) |        180 (70) |      1000 |
| Legendary  | Gurda (Desert Dragon)    |   800 |          70 (45) |          155 (60) |             220 (88) |          140 (52) |        210 (78) |      1150 |
| Legendary  | Ashkar the Eternal       |   820 |          75 (45) |          160 (62) |             230 (90) |          145 (54) |        220 (80) |      1180 |
| Legendary  | Seraphis the Dawn Tyrant |   840 |          82 (46) |          165 (64) |             240 (92) |          150 (56) |        225 (82) |      1200 |
| ---------- | ----------------         | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Legendary+ | Arc Academia             |   880 |          85 (50) |          170 (65) |             250 (95) |          150 (55) |        230 (85) |      1250 |
| Legendary+ | Arc Dragon Oximo         |   920 |          90 (52) |          180 (68) |            270 (100) |          160 (58) |        250 (90) |      1350 |
| Legendary+ | Arc Seraphis             |   900 |          88 (50) |          175 (66) |             260 (98) |          155 (56) |        240 (88) |      1300 |
| -------    | --------------------     | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Supreme    | Legion                   |  1050 |         100 (60) |          210 (75) |            300 (110) |          180 (65) |        280 (95) |      1500 |
| Supreme    | World Eater Behemoth     |  1100 |         105 (62) |          220 (78) |            320 (120) |          190 (68) |       300 (100) |      1600 |
| Supreme    | Astral Sovereign         |  1080 |         102 (60) |          215 (76) |            310 (115) |          185 (66) |        290 (98) |      1550 |
| --------   | ------------------       | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| Supreme+   | Arc Legion               |  1250 |         120 (70) |          250 (85) |            360 (130) |          220 (75) |       330 (110) |      1800 |
| Supreme+   | Absolute Dominion        |  1300 |         125 (72) |          260 (88) |            380 (140) |          230 (78) |       350 (120) |      1850 |
| Supreme+   | Celestial Devourer       |  1280 |         122 (70) |          255 (86) |            370 (135) |          225 (76) |       340 (115) |      1820 |
| ------     | --------------           | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| S          | Paradox Knight           |  1450 |         140 (80) |         300 (100) |        Reality Split |          260 (90) |       400 (140) |      2000 |
| S          | Chrono Ravager           |  1500 |         145 (82) |         320 (105) |        Time Collapse |          270 (92) |       420 (145) |      2100 |
| ------     | ---------------          | ----: | ---------------: | ----------------: |   -----------------: | ----------------: | --------------: |      ---: |
| S+         | Reality Breaker          |  1650 |         160 (90) |         360 (120) |         Rule Shatter |         300 (100) |       460 (160) |      2300 |
| S+         | Void Saint               |  1700 |         165 (92) |         380 (125) |         Void Baptism |         310 (102) |       480 (165) |      2400 |
| ------     | -------------------      | ----: | ---------------: | ----------------: | -------------------: | ----------------: | --------------: |      ---: |
| SS         | Dimensional Emperor      |  1900 |        180 (100) |         420 (140) |   Dimension Override |         340 (115) |       520 (180) |      2700 |
| SS         | Starfall Harbinger       |  1850 |         175 (98) |         400 (135) | Stellar Annihilation |         330 (112) |       500 (175) |      2600 |
| ------     | ----------------         | ----: |        --------: |        ---------: |       -------------: |        ---------: |        -------: |  -------: |
| SS+        | Law of Ruin              |  2300 |         Absolute |          Absolute |       System Erasure |          Absolute |        Absolute |  Infinite |
| SS+        | Infinite Arbiter         |  2400 |         Absolute |          Absolute |         Judgment End |          Absolute |        Absolute |  Infinite |
| ------     | -------------------      | ----: |       ---------: |        ---------: |     ---------------: |        ---------: |      ---------: | --------: |
| SSS        | Origin Destroyer         |  3000 |       Conceptual |        Conceptual |         Origin Sever |        Conceptual |      Conceptual | Undefined |
| SSS        | Eternal Singularity      |  3200 |       Conceptual |        Conceptual |     Eternal Collapse |        Conceptual |      Conceptual | Undefined |
| ------     | -------------------      | ----: |        --------: |        ---------: |        ------------: |        ---------: |        -------: |      ---: |
| SSS+       | Apex of Nothingness      |     ∞ |              N/A |               N/A |           Total Null |               N/A |             N/A |       N/A |
| SSS+       | Final Observer           |     ∞ |              N/A |               N/A |        End Condition |               N/A |             N/A |       N/A |
| ------     | --------------           | ----: |        --------: |        ---------: |          ----------: |        ---------: |        -------: |   ------: |
| Extra      | V0ID                     |     ∞ |          Corrupt |           Consume |               Delete |           Corrupt |         Consume |      None |
| Extra      | Sphyus                   |     ∞ |          Rewrite |           Rewrite |              Rewrite |           Rewrite |         Rewrite |   Rewrite |
| Extra      | Null Architect           |     ∞ |            Build |           Destroy |            Recompile |            Ignore |          Ignore |    System |
| Extra      | End-of-All               |     ∞ |                – |                 – |          Termination |                 – |               – |         – |
