window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AIYahtzee: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f539fwGMytAI5QBpzVwwts6", "AIYahtzee");
    "use strict";
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        this.player = this.getComponent("PlayerYahtzee");
      },
      check: function check() {
        var elementList = [ 0, 0, 0, 0, 0, 0 ];
        for (var i = 0; i < 5; i++) {
          var dice = this.player.diceList[i].getComponent("DiceYahtzee");
          elementList[dice.element - 1]++;
        }
        var maxIndex = -1;
        var secIndex = -1;
        for (var _i = 0; _i < 6; _i++) elementList[_i] > (elementList[maxIndex] || 0) && (maxIndex = _i);
        for (var _i2 = 0; _i2 < 6; _i2++) _i2 != maxIndex && elementList[_i2] > (elementList[secIndex] || 0) && (secIndex = _i2);
        this.scheduleOnce(function() {
          elementList[maxIndex] > 1 ? elementList[maxIndex] == elementList[secIndex] ? this.hold(maxIndex, secIndex) : this.hold(maxIndex) : 1 == this.player.rollCount ? this.player.recycle() : this.player.roll();
        }.bind(this), .8);
      },
      hold: function hold(maxIndex, secIndex) {
        var num = 0;
        for (var i = 0; i < 5; i++) {
          var dice = this.player.diceList[i].getComponent("DiceYahtzee");
          if (dice.holded) {
            if (dice.element != maxIndex + 1 && null != secIndex && dice.element != secIndex + 1) {
              dice.doHold();
              num++;
            }
          } else if (dice.element == maxIndex + 1 || null != secIndex && dice.element == secIndex + 1) {
            dice.doHold();
            num++;
          }
        }
        var duration = num <= 0 ? .3 : .8;
        this.scheduleOnce(function() {
          this.player.roll();
        }.bind(this), duration);
      }
    });
    cc._RF.pop();
  }, {} ],
  AI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6487boeVqBBxohhnx9DSKEj", "AI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        this.player = this.getComponent("Player");
        this.host = this.getComponent("Enemy");
        this.castList = [];
      },
      check: function check() {
        window.mainLayer.gameOver || this.checkCards();
      },
      checkCards: function checkCards() {
        this.checkUsableToken();
        var minRate = 1;
        var minPriority = 100;
        var minCard = null;
        for (var i = 0; i < this.cards.length; i++) {
          var card = this.cards[i].getComponent("Card");
          if (card.usable && (card.cfg.priority < minPriority || card.cfg.priority == minPriority && card.rate > minRate)) {
            minRate = card.rate;
            minPriority = card.cfg.priority;
            minCard = card;
          }
        }
        minCard ? minCard.cast() : this.player.rollCount > 0 && this.cards.length > 0 ? this.scheduleOnce(function() {
          this.checkDice();
        }.bind(this), .8) : this.scheduleOnce(function() {
          this.player.endRound();
        }.bind(this), .6);
      },
      checkDice: function checkDice() {
        if (window.mainLayer.gameOver) return;
        if (this.cards.length <= 0) {
          this.scheduleOnce(function() {
            this.check();
          }.bind(this), 1);
          return;
        }
        var bias = [ 0, 0, 0, 0, 0, 0 ];
        for (var i = 0; i < this.cards.length; i++) {
          var card = this.cards[i].getComponent("Card");
          var requireList = card.require.split(";");
          requireList.length > 1 && bias[requireList[0] - 1]++;
          var letter = [ "A", "B", "C", "D", "E", "F" ];
          for (var j = 0; j < 6; j++) if (card.cfg.desc.indexOf(letter[j]) >= 0) {
            bias[j]++;
            break;
          }
        }
        var isBias = false;
        for (var _i = 0; _i < 6; _i++) if (bias[_i] > 0) {
          isBias = true;
          break;
        }
        var deltaList = [];
        for (var _i2 = 0; _i2 < this.cards.length; _i2++) {
          var _card = this.cards[_i2].getComponent("Card");
          var delta = [ 0, 0, 0, 0, 0, 0 ];
          if (_card.require >= 101 && _card.require <= 105) {
            var maxHold = 0;
            var maxElement = 0;
            for (var _j = 0; _j < 6; _j++) if ((!isBias || bias[_j] > 0) && this.player.elementList[_j] > maxHold) {
              maxHold = this.player.elementList[_j];
              maxElement = _j + 1;
            }
            delta = [ -100, -100, -100, -100, -100, -100 ];
            if (maxHold >= isBias ? 1 : 2) {
              var num = [ 2, 3, 3, 4, 5 ];
              delta[maxElement - 1] = num[_card.require - 101] - maxHold;
            }
          } else {
            var require = [ 0, 0, 0, 0, 0, 0 ];
            if (106 == _card.require || 107 == _card.require) require = [ 1, 1, 1, 1, 1, 1 ]; else {
              var requireList = _card.require.split(";");
              for (var _i3 = 0; _i3 < requireList.length; _i3++) require[requireList[_i3] - 1]++;
            }
            var _letter = [ "A", "B", "C", "D", "E", "F" ];
            for (var _i4 = 0; _i4 < 6; _i4++) {
              var requireCount = require[_i4];
              _card.cfg.desc.indexOf(_letter[_i4]) >= 0 && (requireCount = this.player.elementList[_i4] + 1);
              delta[_i4] = requireCount - this.player.elementList[_i4];
            }
          }
          deltaList.push(delta);
        }
        var maxNum = 100;
        var maxSum = 0;
        var maxIndex = 0;
        var minRate = 1;
        for (var _i5 = 0; _i5 < deltaList.length; _i5++) {
          var _delta = deltaList[_i5];
          var _num = 0;
          var sum = 0;
          for (var _j2 = 0; _j2 < _delta.length; _j2++) {
            _num += _delta[_j2] < -10 ? 0 : Math.abs(_delta[_j2]);
            sum += _delta[_j2];
          }
          if (_num < maxNum || _num == maxNum && sum > maxSum || _num == maxNum && sum == maxSum && this.cards[_i5].getComponent("Card").rate < minRate) {
            maxNum = _num;
            maxSum = sum;
            maxIndex = _i5;
            minRate = this.cards[_i5].getComponent("Card").rate;
          }
        }
        var targetDelta = deltaList[maxIndex];
        for (var _i6 = 0; _i6 < 6; _i6++) if (0 != targetDelta[_i6]) {
          var _num2 = targetDelta[_i6] + this.player.elementList[_i6] - this.player.holdList[_i6];
          if (_num2 > 0) for (var _j3 = 0; _j3 < this.dices.length; _j3++) {
            var dice = this.dices[_j3].getComponent("Dice");
            if (dice.element == _i6 + 1 && !dice.holded && !dice.lock && !dice.freeze && !dice.temp) {
              dice.hold();
              _num2--;
              if (0 == _num2) break;
            }
          } else if (_num2 < 0) for (var _j4 = 0; _j4 < this.dices.length; _j4++) {
            var _dice = this.dices[_j4].getComponent("Dice");
            if (_dice.element == _i6 + 1 && _dice.holded && !_dice.lock && !_dice.freeze && !_dice.temp) {
              _dice.hold();
              _num2++;
              if (0 == _num2) break;
            }
          }
        }
        this.player.roll();
        var freeDice = false;
        for (var _i7 = 0; _i7 < this.dices.length; _i7++) {
          var _dice2 = this.dices[_i7].getComponent("Dice");
          if (!_dice2.holded && !_dice2.lock && !_dice2.freeze && !_dice2.temp) {
            freeDice = true;
            break;
          }
        }
        this.scheduleOnce(function() {
          freeDice ? this.check() : this.player.endRound();
        }.bind(this), 1);
      },
      checkUsableToken: function checkUsableToken() {
        this.cards = [];
        for (var i = 0; i < this.player.cardList.length; i++) {
          var card = this.player.cardList[i].getComponent("Card");
          card.silence || card.burn && !(window.mainLayer.enemy.hp > 3) || this.cards.push(card);
        }
        this.dices = [];
        for (var _i8 = 0; _i8 < this.player.diceList.length; _i8++) {
          var dice = this.player.diceList[_i8];
          dice.lock || this.dices.push(dice);
        }
      },
      insertAndCast: function insertAndCast(card) {}
    });
    cc._RF.pop();
  }, {} ],
  Buff: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76faa8y1jVIcqDL176r9ktK", "Buff");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        buffBox: cc.Node,
        txtBuff: cc.RichText
      },
      init: function init() {
        this.player = this.getComponent("Player");
        this.opponent = this.player.opponent;
        this.buffList = [];
        this.doubleDmg = 1;
        this.doubleCast = 0;
        this.multiCast = 0;
        this.multiCastMax = 0;
        this.selfHarmCast = 0;
        this.selfHarmCastMax = 0;
        this.elementRoundCasted = [ 0, 0, 0, 0, 0, 0 ];
        this.iteraList = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        this.iteraList2 = [ 0, 0, 0, 0, 0, 0 ];
        this.burnIce = false;
        this.silenceDark = false;
        this.table = {};
        var buffIdList = [ 13, 21, 22, 23, 24, 25, 26, 27, 28, 101, 102, 103, 104, 105, 106 ];
        for (var i = 0; i < buffIdList.length; i++) this.table[buffIdList[i]] = 0;
        this.quote();
        this.refreshBuff();
      },
      addBuff: function addBuff(buffId, count) {
        if (count <= 0) return;
        if (13 == buffId) this.player.anim.show(13); else if (buffId >= 21 && buffId <= 28) {
          if (this.immunity > 0) {
            this.removeBuff(105, 1);
            this.player.equip.doTrigger(37);
            this.player.assertHpChange("MISS", 3);
            return;
          }
          if (buffId <= 26) {
            if (this.opponent.equip.checkWithTrigger(buffId + 10)) {
              var bonus = 26 == buffId ? 2 : 1;
              count += bonus;
            }
            23 == buffId && this.opponent.equip.trigger(68);
          }
          this.player.anim.show(buffId);
        }
        this.table[buffId] += count;
        this.quote();
        var exist = false;
        for (var i = 0; i < this.buffList.length; i++) if (this.buffList[i] == buffId) {
          exist = true;
          break;
        }
        exist || this.buffList.push(buffId);
        this.refreshBuff();
      },
      removeBuff: function removeBuff(buffId, count) {
        if (count <= 0) return;
        this.table[buffId] -= count;
        if (this.table[buffId] <= 0) {
          this.table[buffId] = 0;
          var index = this.buffList.indexOf(buffId);
          null != index && this.buffList.splice(index, 1);
        }
        this.quote();
        this.refreshBuff();
      },
      quote: function quote() {
        this.dodge = this.table[13];
        this.burn = this.table[21];
        this.freeze = this.table[22];
        this.frail = this.table[23];
        this.weak = this.table[24];
        this.silence = this.table[25];
        this.poison = this.table[26];
        this.curse = this.table[27];
        this.lock = this.table[28];
        this.exRound = this.table[101];
        this.undead = this.table[102];
        this.atkBack = this.table[103];
        this.atkAdd = this.table[104];
        this.immunity = this.table[105];
        this.hurtReduce = this.table[106];
      },
      refreshBuff: function refreshBuff() {
        var str = "";
        var nameList = {
          13: "\u95ea\u907f",
          21: "\u71c3\u70e7",
          22: "\u51bb\u7ed3",
          23: "\u6613\u4f24",
          24: "\u865a\u5f31",
          25: "\u6c89\u9ed8",
          26: "\u4e2d\u6bd2",
          27: "\u8bc5\u5492",
          28: "\u7981\u9522",
          101: "\u989d\u5916\u56de\u5408",
          102: "\u4e0d\u6b7b",
          103: "\u53cd\u4f24",
          104: "\u4f24\u5bb3\u63d0\u5347",
          105: "\u514d\u75ab",
          106: "\u53d7\u4f24\u964d\u4f4e"
        };
        var colors = {
          13: "FFF830",
          21: "FF5567",
          22: "42EBFF",
          23: "FF5567",
          24: "D68F5E",
          25: "42EBFF",
          26: "BF7FE4",
          27: "B1B1B1",
          28: "E2BD6D",
          101: "FFF830",
          102: "FF5567",
          103: "FF5567",
          104: "FFF830",
          105: "42EBFF",
          106: "FF5567"
        };
        if (1 == this.buffList.length) {
          var buffId = this.buffList[0];
          str += "<img src='" + this.getBuffImg(buffId) + "'/>";
          str += "<color=" + colors[buffId] + ">" + nameList[buffId] + this.table[buffId] + "</c>";
        } else for (var i = 0; i < this.buffList.length; i++) {
          var _buffId = this.buffList[i];
          str += "<img src='" + this.getBuffImg(_buffId) + "'/>";
          var string = "<color=" + colors[_buffId] + ">" + this.table[_buffId] + "</c>  ";
          str += string;
        }
        this.player.host.txtBuff.string = str;
        if (this.buffBox.active) {
          var str = "";
          for (var _i = 0; _i < this.buffList.length; _i++) {
            var _buffId2 = this.buffList[_i];
            str += "<img src='" + this.getBuffImg(_buffId2) + "'/>";
            str += "<color=" + colors[_buffId2] + ">" + nameList[_buffId2] + this.table[_buffId2] + "</c>  ";
            (_i + 1) % 3 == 0 && this.buffList.length > _i + 1 && (str += "\r\n");
          }
          this.txtBuff.string = str;
          this.buffBox.height = 44 + 30 * Math.floor((this.buffList.length - 1) / 3);
        }
      },
      getBuffImg: function getBuffImg(id) {
        var imgs = {
          13: "dodge",
          21: "burn",
          22: "freeze",
          23: "frail",
          24: "weak",
          25: "silence",
          26: "poison",
          27: "curse",
          28: "lock",
          101: "exRound",
          102: "undead",
          103: "atkback",
          104: "atkAdd",
          105: "immunity",
          106: "hurtReduce"
        };
        var src = imgs[id];
        if (23 == id) {
          var rate = 0;
          (this.opponent.equip.check(54) || this.opponent.equip.check(113) || this.player.equip.check(113)) && rate++;
          this.player.equip.check(56) && rate--;
          rate > 0 ? src = "frailPlus" : rate < 0 && (src = "frailMinus");
        } else 24 == id && this.opponent.equip.check(55) && (src = "weakPlus");
        return src;
      },
      openBuffList: function openBuffList() {
        if (this.buffList.length <= 1) return;
        if (window.mainLayer.buffTip) {
          if (window.mainLayer.buffTip == this) {
            this.hideTip();
            return;
          }
          window.mainLayer.buffTip.hideTip();
        }
        this.buffBox.active = true;
        this.refreshBuff();
        window.mainLayer.buffTip = this;
        this.scheduleOnce(this.hideTip, 5);
      },
      hideTip: function hideTip() {
        this.unscheduleAllCallbacks();
        this.buffBox.active = false;
        window.mainLayer.buffTip = null;
      }
    });
    cc._RF.pop();
  }, {} ],
  CampLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b0d89nUwu5Nl4dwKJDLgM6m", "CampLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onHeal: function onHeal() {
        var rate = 1;
        game.equip.indexOf(39) >= 0 && (rate += .5);
        game.equip.indexOf(89) >= 0 && (rate -= .5);
        var hp = Math.floor(.35 * game.hpMax * rate);
        game.hp = Math.min(game.hp + hp, game.hpMax);
        this.close();
      },
      onCopper: function onCopper() {
        game.copper += 7 * (game.castle + 3);
        this.close();
      },
      close: function close() {
        this.node.destroy();
        window.homeLayer.refreshHeroData();
        window.room.btnAlter.node.active = false;
        game.floorBeats[game.floor - 1] = true;
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  CardBagLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2534fgAL1FKcLXmME7NK5RR", "CardBagLayer");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        cardPrefab: cc.Prefab,
        chestPrefab: cc.Prefab,
        boxDeck: cc.Node,
        content: cc.Node,
        mask: cc.Node
      },
      onLoad: function onLoad() {
        window.bagLayer = this;
        this.getComponent(cc.Widget).top = cc.winSize.height / cc.winSize.width * 750;
        this.getComponent(cc.Widget).bottom = -cc.winSize.height / cc.winSize.width * 750;
        var delayTime = 0;
        if (window.equipLayer) {
          delayTime = .15;
          window.equipLayer.close();
        } else if (window.mapLayer) {
          delayTime = .15;
          window.mapLayer.close();
        }
        this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.moveTo(.15, cc.v2(0, 0)), cc.callFunc(function() {
          this.mask.active = true;
          this.getComponent(cc.Widget).top = 0;
          this.getComponent(cc.Widget).bottom = 0;
        }.bind(this))));
        this.initDeck();
        this.initBag();
        if (game.newCard) {
          game.newCard = false;
          window.homeLayer.refreshHeroData();
        }
      },
      initDeck: function initDeck() {
        this.deck = [];
        var countInRow = 2 == game.heroId ? 2 : 3;
        for (var i = 0; i < game.deck.length; i++) {
          var card = cc.instantiate(this.cardPrefab);
          card.getComponent("CardCollection").init(game.deck[i], 0);
          card.position = cc.v2(i % countInRow * 247 - 247, 104 - 210 * Math.floor(i / countInRow));
          this.boxDeck.addChild(card);
          this.deck[i] = card;
        }
        if (2 == game.heroId) {
          var chest = cc.instantiate(this.chestPrefab);
          chest.position = cc.v2(240, 0);
          this.boxDeck.addChild(chest);
        }
      },
      initBag: function initBag() {
        game.cardBag.sort(function(a, b) {
          return config.get("cfg_card", a).element == config.get("cfg_card", b).element ? a - b : config.get("cfg_card", a).element - config.get("cfg_card", b).element;
        });
        this.bagList = [];
        for (var i = 0; i < game.cardBag.length; i++) {
          var card = cc.instantiate(this.cardPrefab);
          card.getComponent("CardCollection").init(game.cardBag[i], 1);
          card.position = cc.v2(i % 3 * 247 - 247, -120 - 210 * Math.floor(i / 3));
          this.content.addChild(card);
          this.bagList.push(card);
        }
        this.contentHeight = cc.winSize.height / cc.winSize.width * 750 - 1334 + 530;
        this.content.height = Math.max(210 * Math.ceil(game.cardBag.length / 3) + 20, this.contentHeight);
      },
      equip: function equip(card) {
        var pos = -1;
        var deckCount = 2 == game.heroId ? 4 : 6;
        for (var i = 0; i < deckCount; i++) if (null == this.deck[i]) {
          pos = i;
          break;
        }
        if (pos >= 0) {
          card.parent = this.boxDeck;
          var countInRow = 2 == game.heroId ? 2 : 3;
          card.position = cc.v2(pos % countInRow * 247 - 247, 104 - 210 * Math.floor(pos / countInRow));
          card.getComponent("CardCollection").colletType = 0;
          var cardId = card.getComponent("CardCollection").cfgId;
          this.deck[pos] = card;
          var index = game.cardBag.indexOf(cardId);
          game.cardBag.splice(index, 1);
          var index = this.bagList.indexOf(card);
          this.bagList.splice(index, 1);
          this.refreshBag();
        }
      },
      unEquip: function unEquip(card) {
        var index = this.deck.indexOf(card);
        this.deck[index] = null;
        var pos = game.cardBag.length;
        var cardId = card.getComponent("CardCollection").cfgId;
        for (var i = 0; i < game.cardBag.length; i++) if (config.get("cfg_card", cardId).element < config.get("cfg_card", game.cardBag[i]).element || config.get("cfg_card", cardId).element == config.get("cfg_card", game.cardBag[i]).element && cardId < game.cardBag[i]) {
          pos = i;
          break;
        }
        game.cardBag.splice(pos, 0, cardId);
        this.bagList.splice(pos, 0, card);
        card.parent = this.content;
        card.position = cc.v2(pos % 3 * 247 - 247, -120 - 210 * Math.floor(pos / 3));
        card.getComponent("CardCollection").colletType = 1;
        this.refreshBag();
      },
      refreshBag: function refreshBag() {
        for (var i = 0; i < this.bagList.length; i++) this.bagList[i].runAction(cc.moveTo(.15, cc.v2(i % 3 * 247 - 247, -120 - 210 * Math.floor(i / 3))));
        this.content.height = Math.max(210 * Math.ceil(game.cardBag.length / 3) + 20, this.contentHeight);
      },
      close: function close() {
        game.deck = [];
        for (var i = 0; i < 6; i++) null != this.deck[i] && game.deck.push(this.deck[i].getComponent("CardCollection").cfgId);
        this.mask.active = false;
        this.node.runAction(cc.sequence(cc.moveTo(.15, cc.v2(0, -cc.winSize.height / cc.winSize.width * 750)), cc.callFunc(function() {
          this.node.destroy();
          window.bagLayer = null;
          window.homeLayer.btnDeck.runAction(cc.sequence(cc.scaleTo(.1, 1.1), cc.scaleTo(.1, 1)));
        }.bind(this))));
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  CardCollection: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a28bfVp4ABL54sr47isHV8F", "CardCollection");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtTitle: cc.Label,
        txtTitle2: cc.Label,
        txtDesc: cc.RichText,
        txtRequire: cc.Label,
        btn: cc.Button,
        box: cc.Node,
        requirePrefab: cc.Prefab,
        titles: [ cc.Node ],
        requireNode: cc.Node,
        markDelete: cc.Node
      },
      init: function init(cfgId, colletType) {
        this.cfgId = cfgId;
        this.cfg = config.get("cfg_card", cfgId);
        var bgColors = [ cc.color(252, 94, 108), cc.color(123, 200, 255), cc.color(93, 166, 111), cc.color(229, 138, 81), cc.color(215, 193, 81), cc.color(180, 150, 236), cc.color(150, 150, 158) ];
        var boxColors = [ cc.color(165, 56, 77), cc.color(90, 109, 149), cc.color(64, 107, 80), cc.color(157, 103, 67), cc.color(171, 137, 65), cc.color(95, 77, 139), cc.color(160, 160, 160) ];
        var titileColors = [ cc.color(251, 53, 70), cc.color(86, 160, 255), cc.color(24, 143, 87), cc.color(253, 138, 47), cc.color(227, 188, 49), cc.color(152, 98, 254), cc.color(155, 158, 173) ];
        this.element = this.cfg.element;
        this.btn.node.color = bgColors[this.element - 1];
        this.box.color = boxColors[this.element - 1];
        if (this.cfg.quality > 1) {
          this.titles[this.cfg.quality - 2].active = true;
          this.titles[this.cfg.quality - 2].color = titileColors[this.element - 1];
        }
        this.txtTitle.string = this.txtTitle2.string = this.cfg.name;
        this.txtDesc.string = game.analysisDesc(this.cfg.desc1);
        var require = this.cfg.require;
        if (require >= 101 && require <= 107) {
          var nameList = [ "\u4e00\u5bf9", "\u4e24\u5bf9", "3\u4e2a\u76f8\u540c", "4\u4e2a\u76f8\u540c" ];
          this.txtRequire.string = nameList[require - 101];
          var posXs = [ [ 16, -16 ], [ -38, -62, 62, 38 ], [ 32, 0, -32 ], [ 48, 16, -16, -48 ] ];
          var posList = posXs[require - 101];
          for (var i = 0; i < posList.length; i++) this.createCircle(0, posList[i]);
        } else {
          this.requireNode.y -= 8;
          var requireList = require.split(";");
          var posXs = [ [ 0 ], [ -35, 35 ], [ -65, 0, 65 ], [ -75, -25, 25, 75 ] ];
          var posList = posXs[requireList.length - 1];
          for (var _i = 0; _i < requireList.length; _i++) this.createCircle(parseInt(requireList[_i]), posList[_i]);
        }
        if (null != colletType) {
          this.btn.interactable = true;
          this.colletType = colletType;
        }
      },
      createCircle: function createCircle(element, posX) {
        var circle = cc.instantiate(this.requirePrefab);
        circle.getComponent("RequireRound").init(element, this.element);
        circle.position = cc.v2(posX, 24);
        this.requireNode.addChild(circle);
        element > 0 && circle.getComponent("RequireRound").refreshSatisfy(true);
      },
      changeCollectType: function changeCollectType() {
        0 == this.colletType ? window.bagLayer.unEquip(this.node) : window.bagLayer.equip(this.node);
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  CardManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0cd22DS0RpC5p0+WtMO4gQ6", "CardManager");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    var cardManager = {
      doCast: function doCast(cfgId, card) {
        this.cfgId = cfgId;
        var cfg = config.get("cfg_card", cfgId);
        this.desc = cfg.desc;
        this.card = card;
        if (1 == cfg.target1 || 1 == cfg.target2 || 1 == cfg.target3) {
          window.player.atkPlayed++;
          if (window.opponent.buff.dodge > 0) {
            window.opponent.buff.removeBuff(13, 1);
            window.opponent.assertHpChange("MISS", 2);
            window.opponent.equip.trigger(109);
            return;
          }
        }
        if (cfg.effect1 > 0) {
          this.doEffect(cfg.effect1, cfg.num1, cfg.target1);
          if (!window.mainLayer.gameOver && cfg.effect2 > 0) {
            this.doEffect(cfg.effect2, cfg.num2, cfg.target2);
            !window.mainLayer.gameOver && cfg.effect3 > 0 && this.doEffect(cfg.effect3, cfg.num3, cfg.target3);
          }
        }
        this.doSpecial(cfgId);
      },
      doEffect: function doEffect(effect, num, target) {
        var t = null;
        t = 0 == window.mainLayer.roundId && 1 == target || 1 == window.mainLayer.roundId && 2 == target ? window.mainLayer.enemy : window.mainLayer.hero;
        var buffTarget = t.buff;
        var buffSelf = window.player.buff;
        num += "";
        var n = 0;
        var count = 1;
        if (num < 0) {
          var letter = [ "A", "B", "C", "D", "E", "F" ];
          var element = 0;
          for (var i = 0; i < 6; i++) if (this.desc.indexOf(letter[i]) >= 0) {
            element = i;
            break;
          }
          n = window.player.elementList[element] * Math.abs(parseInt(num));
        } else {
          var numList = num.split(";");
          if (8 == effect) {
            n = parseInt(numList[0]);
            count = parseInt(numList[1]);
          } else if (1 == numList.length) n = parseInt(num); else {
            var min = parseInt(numList[0]);
            var max = parseInt(numList[1]);
            n = window.player.equip.checkWithTrigger(120) ? max : Math.floor(Math.random() * (max - min + 1)) + min;
          }
        }
        if (effect < 10) {
          if (1 == target) {
            n *= buffSelf.doubleDmg;
            buffSelf.doubleDmg = 1;
          }
          if (buffSelf.weak > 0 && !window.player.equip.checkWithTrigger(65)) {
            var rate = .7;
            window.opponent.equip.checkWithTrigger(55) && (rate = .5);
            n = Math.floor(n * rate);
          }
          1 == window.player.atkPlayed && window.player.equip.checkWithTrigger(100) && (n *= 2);
          for (var _i = 0; _i < count; _i++) t.onHurt(n, 0, effect);
        } else 11 == effect ? t.updateArmor(n) : 12 == effect ? t.onHeal(n) : 14 == effect ? t.addPower && t.addPower(n) : (13 == effect || effect >= 21) && buffTarget.addBuff(effect, n);
      },
      doSpecial: function doSpecial(cfgId) {
        var buffTarget = window.opponent.buff;
        var buffSelf = window.player.buff;
        if (132 == cfgId) this.doEffect(11, window.host.armor, 2); else if (133 == cfgId) this.doEffect(7, window.host.armor, 1); else if (134 == cfgId) {
          this.doEffect(7, 2 * window.host.armor, 1);
          this.doEffect(11, -window.host.armor, 2);
        } else if (135 == cfgId) this.doEffect(7, window.host.hpMax - window.host.hp, 1); else if (136 == cfgId) this.doEffect(11, window.host.hpMax - window.host.hp, 2); else if (137 == cfgId) this.doEffect(7, Math.floor(window.host.hp / 2), 1); else if (138 == cfgId) buffSelf.addBuff(102, 2); else if (139 == cfgId) buffSelf.addBuff(101, 1); else if (140 == cfgId) {
          window.player.rollCount++;
          window.player.roll(false, Math.floor(6 * Math.random()) + 1);
        } else if (141 == cfgId) {
          if (window.host.power) {
            this.doEffect(7, 2 * window.host.power, 1);
            window.host.addPower(-window.host.power);
          }
        } else if (142 == cfgId) {
          if (window.host.power) {
            this.doEffect(11, 2 * window.host.power, 2);
            window.host.addPower(-window.host.power);
          }
        } else if (143 == cfgId) {
          if (window.host.power) {
            this.doEffect(12, window.host.power, 2);
            window.host.addPower(-window.host.power);
          }
        } else if (144 == cfgId) this.doEffect(7, 2 * buffTarget.poison, 1); else if (145 == cfgId) this.doEffect(7, 4 * buffTarget.poison, 1); else if (146 == cfgId) buffTarget.addBuff(26, buffTarget.poison); else if (147 == cfgId) {
          var dmg = buffTarget.frail > 0 ? 12 : 6;
          this.doEffect(3, dmg, 1);
        } else if (148 == cfgId) {
          var dmg = buffTarget.weak > 0 ? 12 : 6;
          this.doEffect(4, dmg, 1);
        } else if (149 == cfgId) buffTarget.poison > 0 && this.doEffect(26, 1, 1); else if (150 == cfgId) {
          var dmg = buffTarget.burn > 0 ? 20 : 10;
          this.doEffect(1, dmg, 1);
        } else if (151 == cfgId) buffTarget.freeze > 0 && this.doEffect(22, 1, 1); else if (152 == cfgId) buffTarget.silence > 0 && this.doEffect(25, 1, 1); else if (cfgId >= 153 && cfgId <= 158) {
          var elementList = [ 2, 3, 5, 0, 1, 4 ];
          var require = [ 2, 2, 2, 3, 3, 3 ];
          var countList = [ 1, 1, 2, 2, 2, 1 ];
          var element = elementList[cfgId - 153];
          window.player.elementList[element] >= require[cfgId - 153] && this.doEffect(element + 21, countList[cfgId - 153], 1);
        } else if (cfgId >= 159 && cfgId <= 162) buffTarget.addBuff(Math.floor(8 * Math.random()) + 21, 162 == cfgId ? 2 : 1); else if (cfgId >= 163 && cfgId <= 166) buffSelf.doubleCast++; else if (167 == cfgId) {
          buffSelf.multiCast++;
          buffSelf.multiCastMax++;
        } else if (cfgId >= 168 && cfgId <= 171) buffSelf.doubleDmg *= 2; else if (172 == cfgId) this.doEffect(22, window.opponent.diceCount + window.opponent.extraDice - buffTarget.freeze, 1); else if (173 == cfgId) this.doEffect(21, window.opponent.deck.length - buffTarget.burn, 1); else if (174 == cfgId) this.doEffect(7, 6 * buffTarget.burn, 1); else if (175 == cfgId) this.doEffect(7, 6 * buffTarget.freeze, 1); else if (176 == cfgId) this.doEffect(7, 6 * buffTarget.silence, 1); else if (177 == cfgId) this.doEffect(7, 4 * buffTarget.frail, 1); else if (178 == cfgId) this.doEffect(7, 4 * buffTarget.weak, 1); else if (cfgId >= 179 && cfgId <= 182) {
          var base = [ 1, 6, 6, 10 ];
          var plus = [ 3, 2, 3, 4 ];
          var dmg = base[cfgId - 179] + plus[cfgId - 179] * (buffSelf.iteraList[cfgId - 179] - 1);
          this.doEffect(7, dmg, 1);
        } else if (cfgId >= 183 && cfgId <= 186) {
          var base = [ 8, 13, 15, 21 ];
          var plus = [ 3, 3, 4, 5 ];
          var countMax = [ 2, 4, 3, 4 ];
          var count = Math.min(buffSelf.iteraList[cfgId - 179] - 1, countMax[cfgId - 183]);
          var dmg = base[cfgId - 183] - plus[cfgId - 183] * count;
          this.doEffect(7, dmg, 1);
        } else if (187 == cfgId) this.doEffect(11, 6 + 2 * buffSelf.elementRoundCasted[3], 2); else if (188 == cfgId) this.doEffect(12, 6 + 2 * buffSelf.elementRoundCasted[4], 2); else if (189 == cfgId) this.doEffect(26, 2 * buffSelf.elementRoundCasted[5], 1); else if (190 == cfgId) this.doEffect(1, 10 + 3 * buffSelf.elementRoundCasted[0], 1); else if (191 == cfgId) this.doEffect(2, 10 + 3 * buffSelf.elementRoundCasted[1], 1); else if (192 == cfgId) this.doEffect(3, 10 + 3 * buffSelf.elementRoundCasted[2], 1); else if (193 == cfgId) {
          var count = Math.min(window.opponent.deck.length, 6);
          if (count > 0) {
            var index = Math.floor(Math.random() * count);
            var copyId = window.opponent.deck[index];
            window.opponent.deck.splice(index, 1);
            window.player.patchCard(copyId, true);
            window.player.deck.push(copyId);
          }
        } else if (194 == cfgId) {
          var count = Math.min(window.opponent.deck.length, 6);
          if (count > 0) {
            var index = Math.floor(Math.random() * count);
            var copyId = window.opponent.deck[index];
            window.player.patchCard(copyId, true);
            window.player.deck.push(copyId);
          }
        } else if (195 == cfgId) {
          var count = Math.min(window.opponent.deck.length, 6);
          if (count > 0) {
            var index = Math.floor(Math.random() * count);
            var copyId = window.opponent.deck[index];
            window.player.patchCard(copyId);
          }
        } else if (196 == cfgId) {
          var id = game.getRandomCardId(2);
          window.player.patchCard(id, true);
          window.player.deck.push(id);
        } else if (197 == cfgId) {
          var id = game.getRandomCardId(2);
          var card = window.player.patchCard(id, null, true);
        } else if (198 == cfgId) {
          var callBack = function() {
            var card = window.player.patchCard();
            2 == card.getComponent("Card").element && window.player.cardList.length < 6 ? card.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
              callBack();
            }.bind(this)))) : window.player.scheduleOnce(function() {
              1 == window.mainLayer.roundId && (window.mainLayer.gameOver || window.mainLayer.enemy.ai.check());
            }.bind(this), .8);
          }.bind(this);
          callBack();
        } else if (199 == cfgId) {
          window.player.diceCount++;
          window.player.host.txtDice.string = "\xd7" + window.player.diceCount;
          window.player.createExDice();
        } else if (200 == cfgId) {
          window.player.createExDice();
          window.player.scheduleOnce(function() {
            window.player.createExDice();
          }.bind(this), .4);
        } else if (201 == cfgId) {
          for (var i = 21; i <= 28; i++) buffSelf.removeBuff(i, buffSelf.table[i]);
          for (var _i2 = 0; _i2 < window.player.cardList.length; _i2++) window.player.cardList[_i2].getComponent("Card").clear();
          for (var _i3 = 0; _i3 < window.player.diceList.length; _i3++) window.player.diceList[_i3].getComponent("Dice").clear();
          window.player.checkElement();
        } else if (202 == cfgId) {
          var debuffCount = 0;
          for (var _i4 = 21; _i4 <= 28; _i4++) buffTarget.table[_i4] > 0 && debuffCount++;
          this.doEffect(7, 5 * debuffCount, 1);
        } else if (203 == cfgId) {
          window.player.rollCount++;
          0 == window.mainLayer.roundId && window.mainLayer.hero.checkBtnRoll();
        } else if (204 == cfgId) {
          window.player.rollCount++;
          window.player.roll();
        } else if (205 == cfgId) {
          if (window.player.cardList.length > 0) {
            var index = Math.floor(Math.random() * window.player.cardList.length);
            window.player.cardList[index].getComponent("Card").discard();
            this.doEffect(7, 12, 1);
          }
        } else if (206 == cfgId || 207 == cfgId) {
          if (window.player.cardList.length > 0) {
            var index = Math.floor(Math.random() * window.player.cardList.length);
            var card = window.player.cardList[index].getComponent("Card");
            card.remove();
            card.doDelete();
            this.doEffect(7, 206 == cfgId ? 20 : 30, 1);
          }
        } else if (208 == cfgId) {
          this.doEffect(7, 5 * window.player.cardList.length, 1);
          for (var _i5 = window.player.cardList.length - 1; _i5 >= 0; _i5--) window.player.cardList[_i5].getComponent("Card").discard();
          window.player.cardList = [];
        } else if (cfgId >= 209 && cfgId <= 214) {
          var base = 214 == cfgId ? 2 : 1;
          this.doEffect(cfgId - 209 + 21, base + buffSelf.iteraList2[cfgId - 209] - 1, 1);
        } else if (215 == cfgId) window.opponent.buff.burnIce = true; else if (216 == cfgId) window.opponent.buff.silenceDark = true; else if (217 == cfgId) {
          game.hpMax += 2;
          window.host.hpMax += 2;
          window.host.txtHp.string = window.host.hp + "/" + window.host.hpMax;
          window.host.stripHp.progress = window.host.hp / window.host.hpMax;
        } else if (218 == cfgId) {
          var id = game.getRandomCardId(2);
          window.player.patchCard(id);
        } else if (219 == cfgId) window.player.patchCard(); else if (220 == cfgId) this.doEffect(3, 2 * window.player.atkRound - 1, 1); else if (221 == cfgId) {
          buffSelf.selfHarmCast++;
          buffSelf.selfHarmCastMax++;
        } else if (222 == cfgId) {
          window.host.hpMax += 20;
          window.host.hp += 20;
          window.host.txtHp.string = window.host.hp + "/" + window.host.hpMax;
          window.host.stripHp.progress = window.host.hp / window.host.hpMax;
        }
      }
    };
    module.exports = cardManager;
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  Card: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cfa35/uH59ANIsjw79G+feg", "Card");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    var cardManager = require("CardManager");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtTitle: cc.Label,
        txtTitle2: cc.Label,
        txtDesc: cc.RichText,
        txtRequire: cc.Label,
        mask: cc.Node,
        btn: cc.Button,
        box: cc.Node,
        fires: dragonBones.ArmatureDisplay,
        nodeSilence: cc.Node,
        markSilence: cc.Node,
        animationCursed: cc.Node,
        animationDiscard: dragonBones.ArmatureDisplay,
        requirePrefab: cc.Prefab,
        titles: [ cc.Node ],
        requireNode: cc.Node,
        circleNode: cc.Node,
        maskWhite: cc.Node,
        maskBlack: cc.Node
      },
      init: function init(cfgId, index, buffId) {
        this.cfgId = cfgId;
        this.index = index;
        this.buffId = buffId;
        this.pos = cc.v2(index % 3, Math.floor(index / 3));
        this.delta = 0 == window.mainLayer.roundId ? 1 : -1;
        this.node.position = cc.v2(248 * this.pos.x - 248, 95 - 206 * this.pos.y - 500 * this.delta);
        this.node.opacity = 0;
        var action = cc.spawn(cc.moveTo(.25, cc.v2(this.node.x, 95 - 206 * this.pos.y + 20 * this.delta)), cc.fadeIn(.15));
        this.node.runAction(cc.sequence(cc.delayTime(.2 * (0 == window.mainLayer.roundId ? 1 - this.pos.y : this.pos.y)), action, cc.moveBy(.05, cc.v2(0, 20 * -this.delta))));
        this.cfg = config.get("cfg_card", cfgId);
        this.element = this.cfg.element;
        this.initInfo();
        this.mask.active = true;
        this.btn.node.active = true;
        this.nodeSilence.active = this.fires.node.active = this.animationCursed.active = this.animationDiscard.node.active = false;
        this.isRemove = this.cfg.exile;
        this.usable = false;
        this.isCopy = false;
        this.isTemp = false;
        this.hasCopy = false;
        this.unCost = false;
        this.rate = 1;
        var require = this.require = this.cfg.require;
        if (require >= 101 && require <= 107) {
          var rateList = [ 1 / 6, 1 / 72, 1 / 36, 1 / 216, 1 / 1296, 1 / 216, 1 / 1296 ];
          this.rate = rateList[require - 101];
        } else {
          var _rateList = [ 1 / 6, 1 / 36, 1 / 216, 1 / 1296, 1 / 7776 ];
          this.rate = _rateList[require.split(";").length - 1];
        }
      },
      initInfo: function initInfo() {
        var bgColors = [ cc.color(252, 94, 108), cc.color(123, 200, 255), cc.color(93, 166, 111), cc.color(229, 138, 81), cc.color(215, 193, 81), cc.color(180, 150, 236), cc.color(150, 150, 158) ];
        var boxColors = [ cc.color(165, 56, 77), cc.color(90, 109, 149), cc.color(64, 107, 80), cc.color(157, 103, 67), cc.color(171, 137, 65), cc.color(95, 77, 139), cc.color(160, 160, 160) ];
        var titileColors = [ cc.color(251, 53, 70), cc.color(86, 160, 255), cc.color(24, 143, 87), cc.color(253, 138, 47), cc.color(227, 188, 49), cc.color(152, 98, 254), cc.color(155, 158, 173) ];
        this.btn.node.color = bgColors[this.element - 1];
        this.box.color = boxColors[this.element - 1];
        this.titles[0].active = false;
        this.titles[1].active = false;
        if (this.cfg.quality > 1) {
          this.titles[this.cfg.quality - 2].active = true;
          this.titles[this.cfg.quality - 2].color = titileColors[this.element - 1];
        }
        this.txtTitle.string = this.txtTitle2.string = this.cfg.name;
        this.initDesc();
        this.circleNode.removeAllChildren();
        this.requireCircles = [];
        var require = this.cfg.require;
        this.requireNode.y = 0;
        this.txtDesc.node.height < 25 ? this.requireNode.y -= 10 : this.txtDesc.node.height < 45 && (this.requireNode.y -= 5);
        if (require >= 101 && require <= 107) {
          var nameList = [ "\u4e00\u5bf9", "\u4e24\u5bf9", "3\u4e2a\u76f8\u540c", "4\u4e2a\u76f8\u540c" ];
          this.txtRequire.string = nameList[require - 101];
          var posXs = [ [ 16, -16 ], [ -38, -62, 62, 38 ], [ 32, 0, -32 ], [ 48, 16, -16, -48 ] ];
          var posList = posXs[require - 101];
          for (var i = 0; i < posList.length; i++) this.createCircle(0, posList[i]);
        } else {
          this.txtRequire.string = "";
          this.requireNode.y -= 8;
          var requireList = require.split(";");
          var posXs = [ [ 0 ], [ -35, 35 ], [ -65, 0, 65 ], [ -75, -25, 25, 75 ] ];
          var posList = posXs[requireList.length - 1];
          for (var _i = 0; _i < requireList.length; _i++) {
            var circle = this.createCircle(parseInt(requireList[_i]), posList[_i]);
            circle.zIndex = 4 - _i;
          }
        }
      },
      initWithCopy: function initWithCopy(cfgId, pos) {
        this.cfgId = cfgId;
        this.pos = pos;
        this.isCopy = true;
        this.isTemp = true;
        this.cfg = config.get("cfg_card", cfgId);
        this.require = this.cfg.require;
        this.initBuff();
        this.initDesc();
      },
      remove: function remove() {
        this.btn.interactable = false;
        if (0 == window.mainLayer.roundId) {
          var action = cc.moveBy(.2, cc.v2(0, 500 * -this.delta));
          this.node.runAction(cc.sequence(cc.delayTime(.15 * (1 - this.pos.y)), cc.moveBy(.1, cc.v2(0, 20 * this.delta)), action, cc.callFunc(function() {
            window.player.cardPool.put(this.node);
          }.bind(this))));
        } else {
          var action = cc.spawn(cc.moveBy(.2, cc.v2(0, 500 * -this.delta)), cc.fadeOut(.25));
          this.node.runAction(cc.sequence(cc.delayTime(.15 * this.pos.y), cc.moveBy(.1, cc.v2(0, 20 * this.delta)), action, cc.callFunc(function() {
            window.player.cardPool.put(this.node);
          }.bind(this))));
        }
        var index = window.player.cardList.indexOf(this.node);
        if (index >= 0) {
          window.player.cardList.splice(index, 1);
          0 == window.mainLayer.roundId && window.mainLayer.hero.checkBtnRoll();
        }
      },
      createCircle: function createCircle(element, posX) {
        var circle = cc.instantiate(this.requirePrefab);
        circle.getComponent("RequireRound").init(element, this.element);
        circle.position = cc.v2(posX, 24);
        this.circleNode.addChild(circle);
        this.requireCircles.push(circle);
        return circle;
      },
      initBuff: function initBuff() {
        var buffId = this.buffId;
        this.burn = 21 == buffId;
        if (this.burn) {
          this.fires.node.active = true;
          this.fires.playAnimation("play0", 0);
        } else this.fires.node.active = false;
        this.silence = 25 == buffId;
        if (this.silence) {
          this.maskWhite.active = true;
          this.maskWhite.runAction(cc.sequence(cc.delayTime(.05), cc.callFunc(function() {
            this.maskWhite.active = false;
            this.nodeSilence.active = true;
          }.bind(this))));
          this.titles[1].active = false;
          this.markSilence.stopAllActions();
          this.markSilence.y = 130;
          this.markSilence.runAction(cc.sequence(cc.fadeIn(0), cc.moveBy(.5, cc.v2(0, -15)), cc.delayTime(.5), cc.fadeOut(.5)));
        } else {
          this.nodeSilence.active = false;
          this.titles[1].active = 3 == this.cfg.quality;
        }
      },
      checkRequire: function checkRequire() {
        var usable = false;
        var list = window.player.elementList.concat();
        if (this.require >= 101 && this.require <= 105) {
          var num = [ 2, 2, 3, 4, 5 ];
          var row = 102 == this.require ? 2 : 1;
          var elementList = [];
          for (var i = 0; i < 6; i++) {
            if (list[i] >= num[this.require - 101]) {
              row--;
              elementList.push(i + 1);
            }
            if (102 == this.require && list[i] >= 4) {
              row -= 2;
              elementList.push(i + 1);
              elementList.push(i + 1);
            }
          }
          row <= 0 && (usable = true);
          if (102 != this.require) {
            var plan = 0;
            var preElement = this.requireCircles[0].getComponent("RequireRound").element;
            if (preElement) {
              var _index2 = elementList.indexOf(preElement);
              _index2 < 0 && (plan = elementList.length > 0 ? 1 : -1);
            } else elementList.length > 0 && (plan = 1);
            for (var _i2 = 0; _i2 < this.requireCircles.length; _i2++) {
              var circle = this.requireCircles[_i2].getComponent("RequireRound");
              if (1 == plan) {
                circle.refreshElement(elementList[0]);
                circle.refreshSatisfy(true);
              } else -1 == plan && circle.hideElement();
            }
          } else {
            var planList = [ null, null ];
            var targetElements = [ 0, 0 ];
            var preElement1 = this.requireCircles[0].getComponent("RequireRound").element;
            var preElement2 = this.requireCircles[2].getComponent("RequireRound").element;
            if (preElement1) {
              var index = elementList.indexOf(preElement1);
              if (index >= 0) {
                planList[0] = 0;
                elementList.splice(index, 1);
                targetElements[0] = preElement1;
              }
            }
            if (preElement2) {
              var index = elementList.indexOf(preElement2);
              if (index >= 0) {
                planList[1] = 0;
                elementList.splice(index, 1);
                targetElements[1] = preElement1;
              }
            }
            for (var _i3 = 0; _i3 < 2; _i3++) if (null == planList[_i3]) {
              var _preElement = 0 == _i3 ? preElement1 : preElement2;
              if (_preElement) if (elementList.length > 0) {
                planList[_i3] = 1;
                targetElements[_i3] = elementList[0];
                elementList.splice(0, 1);
              } else planList[_i3] = -1; else if (elementList.length > 0) {
                planList[_i3] = 1;
                targetElements[_i3] = elementList[0];
                elementList.splice(0, 1);
              } else planList[_i3] = 0;
            }
            for (var _i4 = 0; _i4 < this.requireCircles.length; _i4++) {
              var _circle = this.requireCircles[_i4].getComponent("RequireRound");
              var _index3 = _i4 < 2 ? 0 : 1;
              if (1 == planList[_index3]) {
                _circle.refreshElement(targetElements[_index3]);
                _circle.refreshSatisfy(true);
              } else -1 == planList[_index3] && _circle.hideElement();
            }
          }
        } else {
          var require = [ 0, 0, 0, 0, 0, 0 ];
          var requireList = this.require.split(";");
          for (var _i5 = 0; _i5 < requireList.length; _i5++) require[requireList[_i5] - 1]++;
          usable = true;
          for (var _i6 = 0; _i6 < 6; _i6++) if (list[_i6] < require[_i6]) {
            usable = false;
            break;
          }
          for (var _i7 = 0; _i7 < this.requireCircles.length; _i7++) {
            var _circle2 = this.requireCircles[_i7].getComponent("RequireRound");
            if (list[_circle2.element - 1] > 0) {
              _circle2.refreshSatisfy(true);
              list[_circle2.element - 1]--;
            } else _circle2.refreshSatisfy(false);
          }
        }
        this.unCost && (usable = true);
        this.silence && (usable = false);
        this.usable = usable;
        if (usable) {
          this.mask.active = false;
          this.btn.interactable = true;
        } else if (this.silence) {
          this.mask.active = false;
          this.btn.interactable = true;
        } else {
          this.mask.active = true;
          this.btn.interactable = false;
        }
        return usable;
      },
      doCast: function doCast() {
        if (0 == window.mainLayer.roundId) if (window.player.cardPlayedRound >= 5 && window.player.equip.checkWithTrigger(85)) cc.log("\u6700\u591a\u4f7f\u75285\u5f20\u724c"); else if (this.silence) {
          this.markSilence.stopAllActions();
          this.markSilence.y = 90;
          this.markSilence.runAction(cc.sequence(cc.fadeIn(0), cc.moveBy(.5, cc.v2(0, 15)), cc.delayTime(.5), cc.fadeOut(.5)));
        } else this.cast();
      },
      cast: function cast() {
        if (0 == window.mainLayer.roundId) {
          if (this.cfgId >= 205 && this.cfgId <= 208 && !window.player.cardUsabled) return;
        } else if (!window.player.cardUsabled) return;
        this.burn && window.host.onHurt(3, 1, 21);
        var cursed = false;
        var rate = window.opponent.equip.check(107) ? .8 : .5;
        if (window.player.buff.curse && Math.random() < rate) {
          cursed = true;
          window.player.buff.removeBuff(27, 1);
          window.opponent.equip.trigger(108);
        }
        this.btn.interactable = false;
        window.player.cardUsabled = false;
        if (cursed) {
          this.maskWhite.active = true;
          this.maskWhite.runAction(cc.sequence(cc.delayTime(.05), cc.callFunc(function() {
            this.maskWhite.active = false;
            var mark = cc.instantiate(this.animationCursed);
            mark.active = true;
            mark.parent = window.player.boxCard;
            mark.position = this.node.position.add(cc.v2(10, -10));
            mark.zIndex = 100;
            mark.getComponent(dragonBones.ArmatureDisplay).playAnimation("play0");
            mark.getComponent(dragonBones.ArmatureDisplay).on(dragonBones.EventObject.COMPLETE, function() {
              mark.destroy();
            }.bind(this));
            this.maskBlack.active = true;
            this.maskBlack.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
              this.maskBlack.active = false;
              this.endCast();
              198 == this.cfgId && 1 == window.mainLayer.roundId && this.scheduleOnce(function() {
                window.mainLayer.gameOver || window.mainLayer.enemy.ai.check();
              }.bind(this), .5);
            }.bind(this))));
          }.bind(this))));
        } else {
          var action1 = cc.spawn(cc.moveBy(.05, cc.v2(0, -20)), cc.scaleTo(.05, 1));
          var action2 = cc.moveBy(.35, cc.v2(0, 1100)).easing(cc.easeIn(1.5));
          this.node.runAction(cc.sequence(cc.scaleTo(.1, 1.2), action1, action2, cc.callFunc(function() {
            if (!window.mainLayer.gameOver) {
              cardManager.doCast(this.cfgId, this);
              this.endCast();
            }
          }.bind(this))));
        }
        if (!this.isCopy) {
          var index = window.player.cardList.indexOf(this.node);
          if (index >= 0) {
            window.player.cardList.splice(index, 1);
            0 == window.mainLayer.roundId && window.mainLayer.hero.checkBtnRoll();
          }
        }
        this.cfgId >= 179 && this.cfgId <= 186 ? window.player.buff.iteraList[this.cfgId - 179]++ : this.cfgId >= 209 && this.cfgId <= 214 && window.player.buff.iteraList2[this.cfgId - 209]++;
        for (var i = 0; i < 3; i++) if (this.cfg["effect" + (i + 1)] < 10 && 1 == this.cfg["target" + (i + 1)]) {
          var n = 1;
          8 == this.cfg["effect" + (i + 1)] && (n = parseInt(this.cfg["num" + (i + 1)].split(";")[1]));
          window.player.atkRound += n;
        }
        for (var _i8 = 0; _i8 < window.player.cardList.length; _i8++) {
          var card = window.player.cardList[_i8].getComponent("Card");
          (card.cfgId >= 179 && card.cfgId <= 186 || card.cfgId >= 209 && card.cfgId <= 214 || 220 == card.cfgId) && card.initDesc();
        }
        if (!cursed && !this.isCopy && (this.cfgId < 163 || this.cfgId > 166)) if (window.player.buff.selfHarmCast > 0 && this.cfg.effect1 < 10 && 2 == this.cfg.target1) {
          window.player.buff.selfHarmCast--;
          this.reuse();
        } else if (window.player.buff.doubleCast > 0) {
          window.player.buff.doubleCast--;
          this.reuse();
        } else if (window.player.equip.luckyCard > 0) {
          if (9 == window.player.cardPlayed) {
            window.player.equip.luckyCard--;
            window.player.equip.doTrigger(43);
            this.reuse();
          }
          window.player.equip.refreshItemNum(43, window.player.cardPlayed + 1);
        } else if (window.player.buff.multiCast > 0 && (window.player.buff.multiCast < window.player.buff.multiCastMax || Math.random() < .3) && 167 != this.cfgId) {
          window.player.buff.multiCast--;
          this.reuse();
        } else Math.random() < .1 && window.player.equip.checkWithTrigger(117) && this.reuse();
        this.isRemove && this.doDelete();
      },
      endCast: function endCast() {
        if (!this.isCopy) {
          window.player.cardPlayed++;
          window.player.cardPlayedRound++;
          var equip = window.player.equip;
          equip.trigger(1);
          equip.trigger(4);
          equip.trigger(97);
          this.cfg.element <= 6 && equip.trigger(this.cfg.element + 77);
          window.opponent.equip.trigger(24);
        }
        window.player.buff.multiCastMax > 0 && window.player.buff.multiCast <= 0 && (window.player.buff.multiCast = window.player.buff.multiCastMax);
        window.player.buff.selfHarmCastMax > 0 && window.player.buff.selfHarmCast <= 0 && (window.player.buff.selfHarmCast = window.player.buff.selfHarmCastMax);
        window.player.buff.elementRoundCasted[this.cfg.element - 1]++;
        window.player.cardPool.put(this.node);
        window.player.cardUsabled = true;
        1 != window.mainLayer.roundId || this.hasCopy || 198 != this.cfgId && this.scheduleOnce(function() {
          window.mainLayer.gameOver || window.mainLayer.enemy.ai.check();
        }.bind(this), .6);
      },
      discard: function discard() {
        this.btn.interactable = false;
        this.btn.node.active = false;
        this.maskWhite.active = true;
        this.maskWhite.runAction(cc.sequence(cc.delayTime(.05), cc.callFunc(function() {
          this.maskWhite.active = false;
          this.animationDiscard.node.active = true;
          this.animationDiscard.playAnimation("play0");
          this.animationDiscard.on(dragonBones.EventObject.COMPLETE, function() {
            window.player.cardPool.put(this.node);
          }.bind(this));
          this.maskBlack.active = true;
          this.maskBlack.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
            this.maskBlack.active = false;
          }.bind(this))));
        }.bind(this))));
        var index = window.player.cardList.indexOf(this.node);
        if (index >= 0) {
          window.player.cardList.splice(index, 1);
          0 == window.mainLayer.roundId && window.mainLayer.hero.checkBtnRoll();
        }
        window.player.equip.trigger(22);
      },
      doDelete: function doDelete() {
        window.player.equip.trigger(69);
        window.player.equip.trigger(70);
        if (!this.isTemp) {
          var _index = window.player.deck.indexOf(this.cfgId);
          _index >= 0 && window.player.deck.splice(_index, 1);
        }
      },
      reuse: function reuse() {
        var card = cc.instantiate(this.node);
        card.position = this.node.position;
        window.player.boxCard.addChild(card, this.node.zIndex - 1);
        card.getComponent("Card").initWithCopy(this.cfgId, this.pos);
        this.hasCopy = true;
        card.runAction(cc.sequence(cc.delayTime(.8), cc.callFunc(function() {
          card.getComponent("Card").cast();
        }.bind(this))));
      },
      clear: function clear() {
        this.buffId = null;
        this.initBuff();
      },
      initDesc: function initDesc() {
        var desc = game.analysisDesc(this.cfg.desc1);
        if (this.cfgId >= 179 && this.cfgId <= 182) {
          var base = [ 1, 6, 6, 10 ];
          var plus = [ 3, 2, 2, 4 ];
          var n = base[this.cfgId - 179] + plus[this.cfgId - 179] * window.player.buff.iteraList[this.cfgId - 179];
          desc += "<color=#EBC82E>  (\u5f53\u524d" + n + ")</c>";
        } else if (this.cfgId >= 183 && this.cfgId <= 186) {
          var base = [ 8, 13, 13, 18 ];
          var plus = [ 3, 3, 3, 4 ];
          var countMax = [ 2, 4, 4, 4 ];
          var count = Math.min(window.player.buff.iteraList[this.cfgId - 179], countMax[this.cfgId - 183]);
          var n = base[this.cfgId - 183] - plus[this.cfgId - 183] * count;
          desc += "<color=#EBC82E>  (\u5f53\u524d" + n + ")</c>";
        } else if (this.cfgId >= 209 && this.cfgId <= 214) {
          var base = 214 == this.cfgId ? 2 : 1;
          var n = base + window.player.buff.iteraList2[this.cfgId - 209];
          desc += "<color=#EBC82E>  (\u5f53\u524d" + n + ")</c>";
        } else 220 == this.cfgId && (desc += "<color=#EBC82E>  (\u5f53\u524d" + (2 * window.player.atkRound + 1) + ")</c>");
        this.txtDesc.string = desc;
      },
      disCost: function disCost() {
        this.unCost = true;
        for (var i = 0; i < this.requireCircles.length; i++) {
          var circle = this.requireCircles[i].getComponent("RequireRound");
          circle.disCost();
          this.require >= 101 && this.require <= 105 && circle.hideElement();
        }
      }
    });
    cc._RF.pop();
  }, {
    CardManager: "CardManager",
    Config: "Config",
    Game: "Game"
  } ],
  Chest: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "282832AcdZFNov+QpH9gQcZ", "Chest");
    "use strict";
    var utils = require("Utils");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtRequire: cc.RichText,
        btn: cc.Button
      },
      init: function init(index) {
        this.index = index;
        this.node.position = cc.v2(240 * index - 240, -500);
        this.btn.node.color = cc.Color.GRAY;
        this.node.opacity = 0;
        var action = cc.spawn(cc.moveTo(.25, cc.v2(this.node.x, 20)), cc.fadeIn(.15));
        this.node.runAction(cc.sequence(cc.delayTime(.3), action, cc.moveBy(.05, cc.v2(0, -20))));
        this.satisfied = [ false, false, false, false, false, false ];
        this.requireList = utils.getDifferentRandomNum(4, 6, 1);
        this.refreshRequire();
      },
      refreshRequire: function refreshRequire() {
        this.usable = true;
        var str = "";
        var words = [ "\u706b", "\u6c34", "\u98ce", "\u571f", "\u5149", "\u6697" ];
        for (var i = 0; i < this.requireList.length; i++) {
          var element = this.requireList[i];
          if (this.satisfied[element - 1]) str += "<color=#EBC82E>" + words[element - 1] + "</c>"; else {
            str += "<color=#000000>" + words[element - 1] + "</c>";
            this.usable = false;
          }
        }
        this.txtRequire.string = str;
        if (this.usable) {
          this.btn.interactable = true;
          this.btn.node.color = cc.Color.WHITE;
        }
      },
      remove: function remove() {
        this.btn.interactable = false;
        var action = cc.moveBy(.2, cc.v2(0, -500));
        this.node.runAction(cc.sequence(cc.delayTime(.15), cc.moveBy(.1, cc.v2(0, 20)), action, cc.callFunc(function() {
          this.node.destroy();
        }.bind(this))));
        window.player.chestList[this.index] = null;
      },
      checkRequire: function checkRequire() {
        var list = window.player.elementList;
        for (var i = 0; i < 6; i++) list[i] > 0 && !this.satisfied[i] && (this.satisfied[i] = true);
        this.refreshRequire();
      },
      doCast: function doCast() {
        this.remove();
        for (var i = 0; i < 6; i++) window.player.patchCard();
      }
    });
    cc._RF.pop();
  }, {
    Utils: "Utils"
  } ],
  CompleteLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "137d1d4ppZM6ZQ8/MhO2Xgg", "CompleteLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {},
      restart: function restart() {
        game.setDataToBase();
        cc.director.loadScene("helloworld");
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  Config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e9b6cHrlOtILogPlENB3GXp", "Config");
    "use strict";
    var config = {
      jsonTable: {},
      load: function load(callBack) {
        var _this = this;
        var cfgList = [ "cfg_card", "cfg_item", "cfg_monster", "cfg_event" ];
        var num = 0;
        var _loop = function _loop(i) {
          url = "Config/" + cfgList[i];
          cc.loader.loadRes(url, function(err, jsonAsset) {
            this.jsonTable[cfgList[i]] = jsonAsset.json;
            num += 1;
            num == cfgList.length && callBack();
          }.bind(_this));
        };
        for (var i = 0; i < cfgList.length; i++) {
          var url;
          _loop(i);
        }
      },
      get: function get(str, num) {
        return this.jsonTable[str][num];
      }
    };
    module.exports = config;
    cc._RF.pop();
  }, {} ],
  CoverLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8cf180RYjFDS416GS8jeF0h", "CoverLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {},
      gotoMain: function gotoMain(e, index) {
        if (index <= 2) {
          game.heroId = index;
          cc.director.loadScene("helloworld");
        }
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  DiceYahtzee: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0732a2IpoZOOqfHG4WHWwqp", "DiceYahtzee");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        sprite: cc.Sprite
      },
      init: function init(id, index) {
        this.id = id;
        this.index = index;
        this.player = 0 == index ? window.yahtzeeLayer.hero : window.yahtzeeLayer.enemy;
        this.element = 0;
        this.abled = false;
        this.holded = false;
        var delta = this.delta = 0 == this.index ? 1 : -1;
        this.node.position = cc.v2(110 * id - 220, -320 * delta);
        this.node.runAction(cc.sequence(cc.moveBy(.15, cc.v2(0, 340 * delta)), cc.moveBy(.1, cc.v2(0, -20 * delta))));
      },
      roll: function roll(remain) {
        this.abled = true;
        this.holded = false;
        var _index = this.player.holdList.indexOf(this.node);
        _index >= 0 && this.player.holdList.splice(_index, 1);
        if (!remain) {
          this.element = Math.floor(6 * Math.random()) + 1;
          cc.loader.loadRes("Texture/battle/element" + this.element, cc.SpriteFrame, function(err, spriteFrame) {
            this.sprite.spriteFrame = spriteFrame;
          }.bind(this));
          var colorList = [ cc.color(255, 56, 50), cc.color(44, 180, 255), cc.color(0, 247, 118), cc.color(255, 150, 82), cc.color(255, 251, 75), cc.color(191, 127, 228) ];
          this.sprite.node.color = colorList[this.element - 1];
        }
        var x = 50 * Math.random() + 150 * this.id - 325;
        var y = (460 * Math.random() + 240) * this.delta;
        var angle = 150 * Math.random() - 75;
        this.node.runAction(cc.spawn(cc.moveTo(.2, cc.v2(x, y)), cc.rotateTo(.2, angle)));
      },
      doHold: function doHold() {
        if (this.abled) if (this.holded) {
          this.roll(true);
          for (var i = 0; i < this.player.holdList.length; i++) this.player.holdList[i].runAction(cc.moveTo(.1, cc.v2(110 * i - 220, 0)));
          this.player.txtBtn.string = "\u6295\u63b7";
        } else this.hold();
      },
      hold: function hold() {
        this.holded = true;
        this.node.runAction(cc.spawn(cc.moveTo(.2, cc.v2(110 * this.player.holdList.length - 220, 0)), cc.rotateTo(.2, 0)));
        this.player.holdList.push(this.node);
        this.player.holdList.length >= 5 && (this.player.txtBtn.string = "\u7ed3\u675f\u56de\u5408");
      }
    });
    cc._RF.pop();
  }, {} ],
  Dice: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24e6aDXOPZNaoyluEGeZSR/", "Dice");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        sprite: cc.Sprite,
        markIce: cc.Node,
        markLock: cc.Node,
        mask: cc.Node,
        markTemp: cc.Node
      },
      init: function init(id, buffId) {
        this.id = id;
        this.holded = false;
        this.element = 0;
        this.mask.active = false;
        this.temp = false;
        this.buffId = buffId;
        this.markIce.active = this.markIce.markLock = this.markTemp.active = false;
      },
      initBuff: function initBuff() {
        var buffId = this.buffId;
        this.freeze = 22 == buffId;
        this.markIce.active = this.freeze;
        this.lock = 28 == buffId;
        this.markLock.active = this.lock;
      },
      roll: function roll(element) {
        this.element = element || Math.floor(6 * Math.random()) + 1;
        cc.loader.loadRes("Texture/battle/element" + this.element, cc.SpriteFrame, function(err, spriteFrame) {
          this.sprite.spriteFrame = spriteFrame;
        }.bind(this));
        var colorList = [ cc.color(255, 56, 50), cc.color(44, 180, 255), cc.color(0, 247, 118), cc.color(255, 150, 82), cc.color(255, 251, 75), cc.color(191, 127, 228) ];
        this.sprite.node.color = colorList[this.element - 1];
        this.delta = 0 == window.mainLayer.roundId ? 1 : -1;
        this.node.y = 200 * -this.delta;
        this.node.opacity = 0;
        this.node.stopAllActions();
        this.node.runAction(cc.spawn(cc.fadeIn(.15), cc.sequence(cc.moveTo(.15, cc.v2(this.node.x, 20 * this.delta)), cc.moveTo(.1, cc.v2(this.node.x, 0)))));
      },
      doHold: function doHold() {
        0 != window.mainLayer.roundId || this.freeze || this.lock || this.temp || window.player.diceUsabld && this.hold();
      },
      hold: function hold() {
        if (this.holded) {
          this.holded = false;
          this.mask.active = false;
          window.player.holdList[this.element - 1]--;
        } else {
          this.holded = true;
          this.mask.active = true;
          window.player.holdList[this.element - 1]++;
        }
      },
      remove: function remove() {
        var action = cc.spawn(cc.moveBy(.15, cc.v2(0, 250 * -this.delta)), cc.fadeOut(.2));
        this.node.runAction(cc.sequence(cc.moveBy(.1, cc.v2(0, 20 * this.delta)), action, cc.callFunc(function() {
          window.player.dicePool.put(this.node);
        }.bind(this))));
      },
      clear: function clear() {
        this.buffId = null;
        this.initBuff();
      },
      doTemp: function doTemp() {
        this.temp = true;
        this.markTemp.active = true;
        var colorList = [ cc.color(255, 56, 50), cc.color(44, 180, 255), cc.color(0, 247, 118), cc.color(255, 150, 82), cc.color(255, 251, 75), cc.color(191, 127, 228) ];
        this.markTemp.color = colorList[this.element - 1];
      }
    });
    cc._RF.pop();
  }, {} ],
  DmgAnimation: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "267b8j4vWVAPaVTrMCIVdTi", "DmgAnimation");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        atks: [ dragonBones.ArmatureDisplay ],
        heal: dragonBones.ArmatureDisplay,
        fireAtk: dragonBones.ArmatureDisplay,
        waterAtk: dragonBones.ArmatureDisplay,
        windAtk: dragonBones.ArmatureDisplay,
        earthAtk: dragonBones.ArmatureDisplay,
        lightAtk: dragonBones.ArmatureDisplay,
        darkAtk: dragonBones.ArmatureDisplay,
        armor: dragonBones.ArmatureDisplay,
        dodge: dragonBones.ArmatureDisplay,
        frail: dragonBones.ArmatureDisplay,
        weak: dragonBones.ArmatureDisplay,
        silence: dragonBones.ArmatureDisplay,
        poison: dragonBones.ArmatureDisplay,
        curse: dragonBones.ArmatureDisplay,
        lock: dragonBones.ArmatureDisplay,
        atkback: dragonBones.ArmatureDisplay,
        undead: dragonBones.ArmatureDisplay,
        revive: dragonBones.ArmatureDisplay
      },
      init: function init(index) {
        this.index = index;
        this.host = 0 == index ? window.mainLayer.hero : window.mainLayer.enemy;
        this.step = 0;
      },
      show: function show(id) {
        var animation;
        if (id <= 6) {
          var list = [ this.fireAtk, this.waterAtk, this.windAtk, this.earthAtk, this.lightAtk, this.darkAtk ];
          animation = list[id - 1];
        } else if (id >= 7 && id <= 9) {
          animation = this.atks[this.step % 3];
          animation.node.rotation = 360 * Math.random();
        } else if (id <= 13) {
          var list = [ this.armor, this.heal, this.dodge ];
          animation = list[id - 11];
        } else if (id >= 21 && id <= 29) {
          var list = [ this.fireAtk, this.waterAtk, this.frail, this.weak, this.silence, this.poison, this.curse, this.lock, this.atkback ];
          animation = list[id - 21];
        } else 201 == id ? animation = this.undead : 202 == id && (animation = this.revive);
        animation.node.active = true;
        animation.node.zIndex = this.step;
        animation.playAnimation("play0");
        animation.on(dragonBones.EventObject.COMPLETE, function() {
          animation.node.active = false;
        }.bind(this));
        this.host.doShake(id);
        this.step++;
      }
    });
    cc._RF.pop();
  }, {} ],
  EditEndLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "59c2dH9VnhA4aJe05dgG9Jc", "EditEndLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {},
      restart: function restart() {
        game.deck = game.editCfg.deckHero.split(";");
        game.equip = game.editCfg.equip.split(";");
        game.hp = game.hpMax;
        cc.director.loadScene("mainLayer");
      },
      back: function back() {
        cc.director.loadScene("edit");
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  Edit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "463d3gvgvdIabmN6qTyXAVR", "Edit");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        editHpEnemy: cc.EditBox,
        editDice: cc.EditBox,
        editDeckEnemy: cc.EditBox,
        editEquipEnemy: cc.EditBox,
        editDeckHero: cc.EditBox,
        editEquip: cc.EditBox,
        editId: cc.EditBox,
        editHpHero: cc.EditBox
      },
      onLoad: function onLoad() {
        if (game.editCfg) {
          this.editHpEnemy.string = game.editCfg.hpEnemy;
          this.editDice.string = game.editCfg.dice;
          this.editDeckEnemy.string = game.editCfg.deckEnemy;
          this.editEquipEnemy.string = game.editCfg.equipEnemy;
          this.editDeckHero.string = game.editCfg.deckHero;
          this.editEquip.string = game.editCfg.equip;
          this.editHpHero.string = game.editCfg.hpHero;
        }
        this.editId.string = game.heroId;
      },
      goBattle: function goBattle() {
        game.editCfg = {
          hpEnemy: this.editHpEnemy.string,
          dice: this.editDice.string,
          deckEnemy: this.editDeckEnemy.string,
          equipEnemy: this.editEquipEnemy.string,
          deckHero: this.editDeckHero.string,
          equip: this.editEquip.string,
          hpHero: this.editHpHero.string
        };
        var decks = this.editDeckHero.string.split(";");
        game.deck = [];
        for (var i = 0; i < decks.length; i++) game.deck.push(parseInt(decks[i]));
        var equips = this.editEquip.string.split(";");
        game.equip = [];
        for (var _i = 0; _i < equips.length; _i++) game.equip.push(parseInt(equips[_i]));
        game.hp = game.hpMax = parseInt(game.editCfg.hpHero);
        game.heroId = parseInt(this.editId.string);
        game.level = 7;
        cc.director.loadScene("mainLayer");
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  EndLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76da3erO9ZIsr/fOEDhJf5d", "EndLayer");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        cardPrefab: cc.Prefab,
        boxReward: cc.Node,
        boxCard: cc.Node,
        boxEquip: cc.Node,
        cardBtns: [ cc.Node ],
        equipBtns: [ cc.Node ],
        txtCopper: cc.Label,
        txtExp: cc.Label,
        txtHp: cc.Label,
        rewardNodes: [ cc.Node ],
        mask: cc.Node,
        endNode: cc.Node,
        txtNext: cc.Node,
        cardNodes: [ cc.Node ],
        equipNodes: [ cc.Node ],
        treasurePrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        window.endLayer = this;
        this.step = 0;
        var count = 2;
        var player = window.mainLayer.hero.player;
        if (1 == game.roomType) if (player.equip.check(26)) {
          game.hpMax += 6;
          game.hp += 6;
          this.rewardNodes[2].active = true;
          count++;
          this.step++;
        } else this.initCards(); else this.initEquip();
        var heal = 0;
        player.equip.trigger(7) && (heal += 6);
        player.equip.trigger(8) && (heal += 10);
        if (heal > 0) {
          this.rewardNodes[3].active = true;
          this.txtHp.string = heal;
          count++;
        }
        var yList = [ [ 30, -30 ], [ 50, 0, -50 ], [ 60, 20, -20, -60 ] ];
        var ys = yList[count - 2];
        for (var i = 0; i < count; i++) this.rewardNodes[i].y = ys[i] - 20;
        this.initCopper();
        this.initExp();
        game.floorBeats[game.floor - 1] = true;
        game.monsterBeats.push(game.monsterId);
        this.mask.on(cc.Node.EventType.TOUCH_START, this.nextStep, this);
        this.boxReward.scale = .8;
        this.boxReward.runAction(cc.sequence(cc.scaleTo(.15, 1.2), cc.scaleTo(.1, 1), cc.callFunc(function() {
          this.step++;
          this.txtNext.active = true;
        }.bind(this))));
      },
      initCards: function initCards() {
        this.boxCard.active = true;
        this.boxCard.y -= cc.winSize.height / cc.winSize.width * 750;
        var quality = 0;
        var qualityList = [ [ .5, .5, 0 ], [ .5, .5, 0 ], [ 0, .5, .5 ] ];
        var random = Math.random();
        var rateSum = 0;
        for (var i = 0; i < 3; i++) {
          rateSum += qualityList[game.castle - 1][i];
          if (random < rateSum) {
            quality = i + 1;
            break;
          }
        }
        this.cardIdList = [];
        var cfgId1 = 0;
        while (cfgId1 <= 0) {
          var id = game.getNewCardId(quality);
          var _require = config.get("cfg_card", id).require;
          (game.castle > 1 || 2 == _require.split(";").length || _require <= 102) && (cfgId1 = id);
        }
        this.cardIdList.push(cfgId1);
        var cfgId2 = 0;
        while (cfgId2 <= 0) {
          var _id = game.getNewCardId(quality);
          var _require2 = config.get("cfg_card", _id).require;
          _id != cfgId1 && (game.castle > 1 || 2 == _require2.split(";").length || _require2 <= 102) && (cfgId2 = _id);
        }
        this.cardIdList.push(cfgId2);
        for (var _i = 0; _i < 2; _i++) {
          var card = cc.instantiate(this.cardPrefab);
          card.getComponent("CardCollection").init(this.cardIdList[_i]);
          card.position = cc.v2(0, 40);
          this.cardNodes[_i].addChild(card);
        }
      },
      chooseCard: function chooseCard(e, index) {
        game.getCard(this.cardIdList[index]);
        this.cardNodes[1 - index].destroy();
        this.cardNodes[index].runAction(cc.moveTo(.2, cc.v2(0, 0)));
        this.cardBtns[0].active = this.cardBtns[1].active = false;
        this.step++;
        this.txtNext.active = true;
      },
      initCopper: function initCopper() {
        var level = window.mainLayer.enemy.cfg.level;
        var rate = 1;
        var player = window.mainLayer.hero.player;
        player.equip.check(73) && (rate += .5);
        if (game.itemEffect.pen > 0) {
          rate += 1;
          game.itemEffect.pen--;
        }
        player.equip.check(90) && (rate -= .5);
        var moneyList = [ 6, 8, 10, 12, 14, 16, 0 ];
        var copper = Math.max(moneyList[level - 1] * rate, 1);
        this.txtCopper.string = copper;
        game.copper += copper;
      },
      initExp: function initExp() {
        var level = window.mainLayer.enemy.cfg.level;
        var bossExps = [ 5, 11, 19, 29, 41, 55, 70 ];
        var maxList = [ 7, 15, 25, 37, 51, 67, 150 ];
        var exp = 1 == game.roomType ? level : bossExps[level - 1];
        this.txtExp.string = exp;
        game.exp += exp;
        var expMax = maxList[game.level - 1];
        if (game.exp >= expMax) {
          game.exp -= expMax;
          game.level++;
          game.hpMax += 5;
          game.hp = window.mainLayer.hero.hp = game.hpMax;
          game.levelUp = true;
        }
      },
      initEquip: function initEquip() {
        this.boxEquip.active = true;
        this.boxEquip.y -= cc.winSize.height / cc.winSize.width * 750;
        var quality = 0;
        var qualityList = [ [ .5, .3, .2 ], [ .2, .4, .4 ], [ 0, .5, .5 ] ];
        var random = Math.random();
        var rateSum = 0;
        for (var i = 0; i < 3; i++) {
          rateSum += qualityList[game.castle - 1][i];
          if (random < rateSum) {
            quality = i + 1;
            break;
          }
        }
        this.cfgIdList = [];
        var cfgId = game.getNewItemId(2, quality);
        this.cfgIdList.push(cfgId);
        if (7 == game.roomType) {
          var cfgId2 = 0;
          while (cfgId2 <= 0) {
            var id = game.getNewItemId(2, quality);
            id != cfgId && (cfgId2 = id);
          }
          this.cfgIdList.push(cfgId2);
        }
      },
      showEquip: function showEquip() {
        if (1 == this.cfgIdList.length) {
          var item = cc.instantiate(this.treasurePrefab);
          item.getComponent("Treasure").init(this.cfgIdList[0]);
          item.y = -120;
          this.boxEquip.addChild(item);
          game.getItem(this.cfgIdList[0]);
          this.equipNodes[0].active = false;
          this.equipNodes[1].active = false;
          this.scheduleOnce(function() {
            this.step++;
            this.txtNext.active = true;
          }.bind(this), 1);
        } else for (var i = 0; i < 2; i++) {
          var item = cc.instantiate(this.treasurePrefab);
          item.getComponent("Treasure").init(this.cfgIdList[i]);
          item.y = -120;
          this.equipNodes[i].addChild(item);
          this.equipBtns[i].y -= 150;
          var action = cc.spawn(cc.fadeIn(.2), cc.sequence(cc.moveBy(.2, cc.v2(0, 160)), cc.moveBy(.1, cc.v2(0, -10))));
          this.equipBtns[i].runAction(cc.sequence(cc.delayTime(.8), action));
        }
      },
      chooseEquip: function chooseEquip(e, index) {
        game.getItem(this.cfgIdList[index]);
        this.equipNodes[1 - index].destroy();
        this.equipNodes[index].runAction(cc.moveTo(.2, cc.v2(0, 0)));
        this.equipBtns[0].active = this.equipBtns[1].active = false;
        this.step++;
        this.txtNext.active = true;
      },
      nextStep: function nextStep() {
        if (this.txtNext.active) if (1 == this.step) {
          this.txtNext.active = false;
          this.endNode.runAction(cc.sequence(cc.moveBy(.35, cc.v2(0, cc.winSize.height / cc.winSize.width * 750)), cc.callFunc(function() {
            game.roomType >= 6 && this.showEquip();
          }.bind(this))));
        } else 2 == this.step && this.close();
      },
      close: function close() {
        game.hp = Math.min(window.mainLayer.hero.hp, game.hpMax);
        game.power = window.mainLayer.hero.power;
        cc.director.loadScene("helloworld");
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  EndYahtzeeLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "87aceT7E4BBK7fY92/xzCKl", "EndYahtzeeLayer");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtTitle: cc.Label,
        txtName: cc.Label,
        cardPrefab: cc.Prefab,
        itemNode: cc.Node,
        txtItemName: cc.Label,
        txtItemDesc: cc.Label,
        itemChangeNode: cc.Node,
        txtChangeName1: cc.Label,
        txtChangeDesc1: cc.Label,
        txtChangeName2: cc.Label,
        txtChangeDesc2: cc.Label,
        losePrefab: cc.Prefab,
        txtChange: cc.Node,
        rewardNode: cc.Node
      },
      init: function init(result) {
        this.result = result;
        var words = [ "\u4f60\u8f93\u4e86", "\u5e73\u5c40", "\u4f60\u8d62\u4e86", "\u4f60\u79bb\u5f00\u4e86" ];
        this.txtTitle.string = words[result + 1];
        this.checkResult();
      },
      checkResult: function checkResult() {
        var eventId = game.eventId;
        var word = "";
        if (0 == this.result || 1 == this.result) {
          if (1 == eventId) {
            word = "\u6062\u590d\u5168\u90e8\u751f\u547d";
            game.hp = game.hpMax;
          } else if (2 == eventId || 14 == eventId) {
            word = "\u989d\u5916\u751f\u547d +15";
            game.hpMax += 15;
            game.hp += 15;
          } else if (3 == eventId) this.getItem(3); else if (4 == eventId) {
            word = "\u91d1\u5e01 +50";
            game.copper += 50;
          } else if (5 == eventId || 6 == eventId) this.getItem(2); else if (7 == eventId) {
            word = "\u91d1\u5e01 -30";
            game.copper = Math.max(game.copper - 30, 0);
            this.getItem(3);
            this.rewardNode.y -= 130;
          } else if (8 == eventId) {
            word = "\u751f\u547d\u4e0a\u9650 +10, \u6062\u590d\u5168\u90e8\u751f\u547d";
            game.hpMax += 10;
            game.hp = game.hpMax;
          } else if (9 == eventId || 17 == eventId) this.getItem(); else if (10 == eventId) {
            word = "\u91d1\u5e01\u7ffb\u500d";
            game.copper *= 2;
          } else if (11 == eventId) {
            word = "\u590d\u5236\u5361\u724c";
            var id = game.deck[Math.floor(Math.random() * game.deck.length)];
            this.getCard(null, id);
            this.rewardNode.y -= 130;
          } else if (12 == eventId || 16 == eventId) {
            word = "\u91d1\u5e01 +100";
            game.copper += 100;
          } else if (13 == eventId) {
            var card = this.getCard(3);
            card.x -= 200;
            var card = this.getCard(3);
            card.x += 200;
          } else if (15 == eventId) {
            word = "\u751f\u547d +30";
            game.hp = Math.min(game.hp + 30, game.hpMax);
          }
        } else if (-1 == this.result) {
          if (1 == eventId) {
            word = "\u751f\u547d +10";
            game.hp = Math.min(game.hp + 10, game.hpMax);
          } else if (2 == eventId || 12 == eventId) {
            word = "\u751f\u547d\u4e0a\u9650 -5";
            game.hpMax = Math.max(game.hpMax - 5, 1);
            game.hp = Math.min(game.hp, game.hpMax);
          } else if (3 == eventId) this.changeItem(); else if (4 == eventId || 9 == eventId) this.getCard(); else if (5 == eventId) {
            word = "\u91d1\u5e01 +20";
            game.copper += 20;
          } else if (6 == eventId || 11 == eventId) this.changeCard(); else if (7 == eventId) {
            word = "\u91d1\u5e01 -30";
            game.copper = Math.max(game.copper - 30, 0);
            this.getItem(2);
            this.rewardNode.y -= 130;
          } else if (8 == eventId || 10 == eventId) {
            word = "\u5931\u53bb\u4e00\u534a\u91d1\u5e01";
            game.copper = Math.ceil(game.copper / 2);
          } else if (13 == eventId) this.deleteCard(0); else if (14 == eventId) {
            word = "\u751f\u547d\u4e0a\u9650 -10";
            game.hpMax = Math.max(game.hpMax - 10, 1);
            game.hp = Math.min(game.hp, game.hpMax);
          } else if (15 == eventId) {
            word = "\u6028\u5ff5\uff1a\u6bcf\u573a\u6218\u6597\u5f00\u59cb\u65f6\uff0c\u635f\u59313\u751f\u547d";
            game.debuff++;
          } else if (16 == eventId) {
            word = "\u751f\u547d -10";
            this.loseHp(10);
          } else if (17 == eventId) {
            word = "\u91d1\u5e01 -30";
            game.copper = Math.max(game.copper - 30, 0);
            this.getCard();
            this.rewardNode.y -= 130;
          }
        } else if (2 == this.result) if (2 == eventId || 15 == eventId) {
          word = "\u751f\u547d -10";
          this.loseHp(10);
        } else if (7 == eventId) {
          word = "\u91d1\u5e01 -30";
          game.copper = Math.max(game.copper - 30, 0);
          this.getItem(1);
          this.rewardNode.y -= 130;
        } else if (12 == eventId) {
          word = "\u91d1\u5e01 -20";
          game.copper = Math.max(game.copper - 20, 0);
        } else if (13 == eventId) {
          this.deleteCard(1, 0);
          this.deleteCard(1, 1);
        } else if (16 == eventId) {
          word = "\u5931\u53bb\u4e00\u534a\u91d1\u5e01";
          game.copper = Math.ceil(game.copper / 2);
        }
        this.txtName.string = word;
        window.homeLayer && window.homeLayer.refreshHeroData();
      },
      close: function close() {
        if (window.homeLayer) this.node.destroy(); else {
          cc.director.loadScene("helloworld");
          game.floorBeats[game.floor - 1] = true;
        }
      },
      getCard: function getCard(quality, id) {
        var cardId = id || game.getNewCardId(quality);
        var card = cc.instantiate(this.cardPrefab);
        card.getComponent("CardCollection").init(cardId);
        this.rewardNode.addChild(card);
        game.getCard(cardId);
        return card;
      },
      getItem: function getItem(quality) {
        var itemId = game.getNewItemId(0, quality);
        this.itemNode.active = true;
        this.txtItemName.string = config.get("cfg_item", itemId).name;
        this.txtItemDesc.string = config.get("cfg_item", itemId).desc;
        game.getItem(itemId);
      },
      loseHp: function loseHp(dmg) {
        game.hp -= dmg;
        if (game.hp <= 0) {
          game.hp += dmg;
          var layer = cc.instantiate(this.losePrefab);
          this.node.addChild(layer);
        }
      },
      changeCard: function changeCard() {
        if (game.deck.length + game.cardBag.length > 0) {
          this.txtChange.active = true;
          var target;
          var index = Math.floor(Math.random() * (game.deck.length + game.cardBag.length));
          if (index < game.deck.length) {
            target = game.deck[index];
            game.deck.splice(index, 1);
          } else {
            target = game.cardBag[index - game.deck.length];
            game.cardBag.splice(index - game.deck.length, 1);
          }
          var cardId = game.getNewCardId();
          game.getCard(cardId);
          var card = cc.instantiate(this.cardPrefab);
          card.getComponent("CardCollection").init(target);
          card.x -= 200;
          this.rewardNode.addChild(card);
          var card = cc.instantiate(this.cardPrefab);
          card.getComponent("CardCollection").init(cardId);
          card.x += 200;
          this.rewardNode.addChild(card);
        } else this.txtName.string = "\u6ca1\u6709\u5361\u724c\u53ef\u53d8\u6362";
      },
      changeItem: function changeItem() {
        if (game.equip.length > 0) {
          var index = Math.floor(Math.random() * game.equip.length);
          var target = game.equip[index];
          game.equip.splice(index, 1);
          var itemId = game.getNewItemId(0);
          game.getItem(itemId);
          this.itemChangeNode.active = true;
          this.txtChangeName1.string = config.get("cfg_item", target).name;
          this.txtChangeDesc1.string = config.get("cfg_item", target).desc;
          this.txtChangeName2.string = config.get("cfg_item", itemId).name;
          this.txtChangeDesc2.string = config.get("cfg_item", itemId).desc;
        } else this.txtName.string = "\u6ca1\u6709\u88c5\u5907\u53ef\u53d8\u6362";
      },
      deleteCard: function deleteCard(type, num) {
        var list = 0 == type ? game.deck : game.cardBag;
        if (list.length > 0) {
          var index = Math.floor(Math.random() * list.length);
          var target = list[index];
          list.splice(index, 1);
          var card = cc.instantiate(this.cardPrefab);
          card.getComponent("CardCollection").init(target);
          card.getComponent("CardCollection").markDelete.active = true;
          null != num && (card.x = 400 * num - 200);
          this.rewardNode.addChild(card);
        } else {
          this.txtName.string = "\u53ef\u79fb\u9664\u5361\u724c\u4e0d\u8db3";
          this.rewardNode.y -= 130;
        }
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  Enemy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dcdbcs6tkpDFZMApS5oUM3A", "Enemy");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        stripHp: cc.ProgressBar,
        barHp: cc.Node,
        txtHp: cc.Label,
        boxBuff: cc.Node,
        txtName: cc.Label,
        txtLevel: cc.Label,
        txtDice: cc.Label,
        txtNum: cc.Node,
        boxArmor: cc.Node,
        txtArmor: cc.Label,
        txtBuff: cc.RichText,
        boxEquip: cc.Node,
        figure: cc.Node,
        figureNode: cc.Node,
        equipDesc: cc.RichText,
        txtExDice: cc.Label
      },
      onLoad: function onLoad() {
        this.player = this.getComponent("Player");
        this.buff = this.getComponent("Buff");
        this.equip = this.getComponent("Equip");
      },
      init: function init() {
        if (game.editCfg) this.initEdit(); else {
          this.cfgId = game.monsterId;
          this.cfg = config.get("cfg_monster", this.cfgId);
          this.hp = this.hpMax = this.cfg.hp;
          this.txtHp.string = this.hp + "/" + this.hpMax;
          this.armor = 0;
          this.diceCount = this.cfg.dice;
          this.equipList = this.cfg.item > 0 ? [ this.cfg.item ] : [];
          this.txtName.string = this.cfg.name;
          this.txtLevel.string = "Lv." + this.cfg.level;
          this.initDeck();
        }
        this.player.init(1);
        this.ai = this.getComponent("AI");
        this.board = window.mainLayer.board;
        cc.loader.loadRes("Texture/monster/" + this.cfgId, cc.SpriteFrame, function(err, spriteFrame) {
          this.figure.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }.bind(this));
        this.figureNode.runAction(cc.sequence(cc.scaleTo(.2, .96, 1.03), cc.scaleTo(.4, 1.03, .96), cc.scaleTo(.2, 1, 1)).repeatForever());
      },
      startRound: function startRound() {
        this.scheduleOnce(function() {
          this.ai.check();
        }.bind(this), 1.5);
        this.board.y = -497;
        this.board.runAction(cc.sequence(cc.delayTime(.5), cc.moveTo(.15, cc.v2(0, -377))));
      },
      endRound: function endRound() {
        this.board.runAction(cc.moveTo(.15, cc.v2(0, -497)));
      },
      onHurt: function onHurt(dmg, source, element) {
        if (window.mainLayer.gameOver) return;
        element = element || 7;
        this.player.onHurt(dmg, source, element);
        if (this.hp <= 0) {
          this.hp = 0;
          window.mainLayer.showEnd(0);
        }
      },
      onHeal: function onHeal(hp) {
        this.equip.checkWithTrigger(76) && (hp = Math.floor(1.5 * hp));
        this.player.onHeal(hp);
        this.player.assertHpChange("+" + hp, 1);
        this.hp = Math.min(this.hp, this.hpMax);
        this.txtHp.string = this.hp + "/" + this.hpMax;
        this.stripHp.progress = this.hp / this.hpMax;
      },
      updateArmor: function updateArmor(num) {
        this.armor += num;
        if (this.armor > 0) {
          this.boxArmor.active = true;
          this.txtArmor.string = this.armor;
          this.stripHp.node.color = cc.color(24, 136, 176);
          this.barHp.color = cc.color(92, 214, 255);
        } else {
          this.armor = 0;
          this.boxArmor.active = false;
          this.stripHp.node.color = cc.color(172, 45, 56);
          this.barHp.color = cc.color(252, 94, 108);
        }
        num > 0 && this.player.anim.show(11);
      },
      initDeck: function initDeck() {
        if (0 == this.cfg.card1) this.deck = window.mainLayer.hero.deck.concat(); else {
          this.deck = [];
          for (var i = 0; i < 6; i++) {
            var cardId = this.cfg["card" + (i + 1)];
            cardId > 0 && this.deck.push(cardId);
          }
        }
      },
      initEdit: function initEdit() {
        this.cfgId = 50;
        this.hp = this.hpMax = parseInt(game.editCfg.hpEnemy);
        this.txtHp.string = this.hp + "/" + this.hpMax;
        this.armor = 0;
        this.diceCount = parseInt(game.editCfg.dice);
        this.txtName.string = "\u6211\u7684\u670b\u53cb\u7279\u6717\u666e";
        this.deck = game.editCfg.deckEnemy.split(";");
        this.equipList = "" != game.editCfg.equipEnemy ? [ game.editCfg.equipEnemy ] : [];
      },
      doShake: function doShake(id) {
        var colors = {
          1: "EA6769",
          2: "30EEFF",
          3: "24A63B",
          4: "978535",
          5: "B98D24",
          6: "5A688F",
          7: "B8565D",
          8: "B8565D",
          9: "B8565D",
          21: "EA6769",
          22: "30EEFF",
          23: "986951",
          24: "70821F",
          25: "52E3A2",
          26: "6E2363",
          27: "486545",
          28: "A17B2A",
          29: "9C434A"
        };
        if (colors[id]) {
          this.figure.color = cc.Color.WHITE.fromHEX("#" + colors[id]);
          this.figure.stopAllActions();
          this.figure.runAction(cc.sequence(cc.moveTo(.05, cc.v2(15, 5)), cc.moveTo(.05, cc.v2(0, 0)), cc.moveTo(.05, cc.v2(-15, -5)), cc.moveTo(.05, cc.v2(0, 0)), cc.moveTo(.05, cc.v2(15, 5)), cc.moveTo(.05, cc.v2(0, 0)), cc.moveTo(.08, cc.v2(-15, -5)), cc.moveTo(.08, cc.v2(0, 0)), cc.callFunc(function() {
            this.figure.position = cc.v2(0, 0);
            this.figure.color = cc.Color.WHITE;
          }.bind(this))));
        }
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  EquipLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d293cR/UttJqLyCy2iTN7xq", "EquipLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        itemPrefab: cc.Prefab,
        content: cc.Node,
        mask: cc.Node
      },
      onLoad: function onLoad() {
        window.equipLayer = this;
        this.getComponent(cc.Widget).top = cc.winSize.height / cc.winSize.width * 750;
        this.getComponent(cc.Widget).bottom = -cc.winSize.height / cc.winSize.width * 750;
        var delayTime = 0;
        if (window.bagLayer) {
          delayTime = .15;
          window.bagLayer.close();
        } else if (window.mapLayer) {
          delayTime = .15;
          window.mapLayer.close();
        }
        this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.moveTo(.15, cc.v2(0, 0)), cc.callFunc(function() {
          this.mask.active = true;
          this.getComponent(cc.Widget).top = 0;
          this.getComponent(cc.Widget).bottom = 0;
        }.bind(this))));
        this.initItems();
      },
      initItems: function initItems() {
        for (var i = 0; i < game.equip.length; i++) {
          var item = cc.instantiate(this.itemPrefab);
          item.getComponent("ItemCollection").init(game.equip[i]);
          item.position = cc.v2(-20, -70 - 124 * i);
          this.content.addChild(item);
        }
        this.content.height = Math.max(124 * game.equip.length + 20, cc.winSize.height / cc.winSize.width * 750 - 1334 + 870);
      },
      close: function close() {
        this.mask.active = false;
        this.node.runAction(cc.sequence(cc.moveTo(.15, cc.v2(0, -cc.winSize.height / cc.winSize.width * 750)), cc.callFunc(function() {
          this.node.destroy();
          window.equipLayer = null;
          window.homeLayer.btnEquip.runAction(cc.sequence(cc.scaleTo(.1, 1.1), cc.scaleTo(.1, 1)));
        }.bind(this))));
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  Equip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a22ddJNtUJBS6PVq98jP/g9", "Equip");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        itemPrefab: cc.Prefab
      },
      init: function init() {
        this.player = this.getComponent("Player");
        this.host = this.player.host;
        this.opponent = this.player.opponent;
        this.index = this.player.index;
        this.equipList = 0 == this.index ? game.equip : this.host.equipList;
        this.boxEquip = this.host.boxEquip;
        this.initItems();
        this.swiftGlove = false;
        this.suckRemainder = 0;
        this.magicSheild = 0;
        this.goldArmor = 0;
        this.luckyCard = 0;
      },
      initItems: function initItems() {
        this.itemList = [];
        if (0 == this.index) {
          for (var i = 0; i < this.equipList.length; i++) if (this.equipList[i] > 0) {
            var _cfg = config.get("cfg_item", this.equipList[i]);
            if (_cfg.battle && (10 != this.equipList[i] || game.itemEffect.feather > 0)) {
              var item = cc.instantiate(this.itemPrefab);
              item.getComponent("Item").init(this.equipList[i], this);
              this.boxEquip.addChild(item);
              this.itemList.push(item);
            }
          }
          for (var _i = 0; _i < this.itemList.length; _i++) {
            var distance = 72;
            this.itemList.length > 10 && (distance = 648 / (this.itemList.length - 1));
            this.itemList[_i].x = distance * _i - 324;
          }
        } else if (this.equipList.length > 0) {
          var _item = cc.instantiate(this.itemPrefab);
          _item.getComponent("Item").init(this.equipList[0], this);
          _item.x = -240;
          _item.scale = .5;
          this.boxEquip.addChild(_item);
          this.itemList.push(_item);
          var cfg = config.get("cfg_item", this.equipList[0]);
          this.host.equipDesc.string = "<color=#FEF64B>" + cfg.name + "\uff1a</c>" + game.analysisDesc(cfg.desc1);
        } else this.boxEquip.active = false;
      },
      check: function check(id) {
        for (var i = 0; i < this.equipList.length; i++) if (this.equipList[i] == id) return true;
        return false;
      },
      checkWithTrigger: function checkWithTrigger(id) {
        if (this.check(id)) {
          this.doTrigger(id);
          return true;
        }
        return false;
      },
      trigger: function trigger(id) {
        var isTrigger = false;
        if (this.check(id)) if (1 == id) {
          this.opponent.host.onHurt(1, 2);
          isTrigger = true;
        } else if (2 == id) {
          if (this.player.cardList.length <= 0) {
            this.host.updateArmor(3);
            isTrigger = true;
          }
        } else if (3 == id) {
          if (this.player.cardList.length <= 0) {
            this.host.onHeal(2);
            isTrigger = true;
          }
        } else if (4 == id) {
          if (this.player.cardList.length <= 0 && !this.swiftGlove) {
            this.swiftGlove = true;
            this.player.patchCard();
            this.host.btnRoll && this.host.checkBtnRoll(true);
            isTrigger = true;
          }
        } else if (5 == id) {
          this.opponent.buff.addBuff(26, 2);
          isTrigger = true;
        } else if (6 == id) {
          this.player.buff.addBuff(13, 1);
          isTrigger = true;
        } else if (7 == id) {
          this.host.onHeal(6);
          isTrigger = true;
        } else if (8 == id) {
          if (this.host.hp < this.host.hpMax / 2) {
            this.host.onHeal(10);
            isTrigger = true;
          }
        } else if (9 == id) {
          this.opponent.host.onHurt(6, 2);
          isTrigger = true;
        } else if (10 == id) {
          if (game.itemEffect.feather > 0) {
            this.player.anim.show(202);
            this.host.hp = Math.floor(.3 * this.host.hpMax);
            isTrigger = true;
            game.itemEffect.feather = -1;
          }
        } else if (11 == id) {
          if (this.host.armor > 0) {
            this.opponent.host.onHurt(this.host.armor, 2);
            this.host.updateArmor(-this.host.armor);
            isTrigger = true;
          }
        } else if (id >= 12 && id <= 18) {
          var countList = [ 3, 3, 2, 2, 2, 4, 2 ];
          this.opponent.buff.addBuff(id + 9, countList[id - 12]);
          isTrigger = true;
        } else if (19 == id) {
          this.player.extraDice++;
          this.host.txtExDice.string = "(+" + this.player.extraDice + ")";
          isTrigger = true;
        } else if (20 == id) {
          this.host.updateArmor(8);
          isTrigger = true;
        } else if (21 == id) this.player.buff.addBuff(104, 1); else if (22 == id) {
          this.opponent.host.onHurt(5, 2);
          isTrigger = true;
        } else if (23 == id) {
          if (this.suckRemainder >= 4) {
            this.host.onHeal(Math.floor(this.suckRemainder / 4));
            this.suckRemainder = this.suckRemainder % 4;
            isTrigger = true;
          }
        } else if (24 == id) {
          this.opponent.host.onHurt(2, 2, 1);
          isTrigger = true;
        } else if (25 == id) {
          if (this.host.hp == this.host.hpMax) {
            this.player.extraDice++;
            this.host.txtExDice.string = "(+" + this.player.extraDice + ")";
            isTrigger = true;
          }
        } else if (27 == id) {
          if (this.host.armor <= 0) {
            this.host.updateArmor(3);
            isTrigger = true;
          }
        } else if (30 == id) {
          if (3 == this.player.round) {
            this.player.extraDice++;
            this.host.txtExDice.string = "(+" + this.player.extraDice + ")";
            isTrigger = true;
          }
        } else if (37 == id) this.player.buff.addBuff(105, 2); else if (44 == id) {
          this.player.buff.addBuff(103, 3);
          isTrigger = true;
        } else if (45 == id) {
          this.scheduleOnce(function() {
            this.player.createExDice();
          }.bind(this), .5);
          isTrigger = true;
        } else if (id >= 48 && id <= 53) {
          this.scheduleOnce(function() {
            window.player.createExDice(id - 47);
          }.bind(this), .5);
          isTrigger = true;
        } else if (57 == id) {
          if (this.player.cardList.length > 0) {
            this.player.extraDice++;
            this.host.txtExDice.string = "(+" + this.player.extraDice + ")";
            isTrigger = true;
          }
        } else if (59 == id) {
          if (this.player.cardList.length > 0) {
            this.host.updateArmor(3 * this.player.cardList.length);
            isTrigger = true;
          }
        } else if (60 == id) {
          if (this.player.cardList.length > 0) {
            this.opponent.host.onHurt(3 * this.player.cardList.length, 2);
            isTrigger = true;
          }
        } else if (61 == id) {
          this.host.onHeal(15);
          isTrigger = true;
        } else if (68 == id) {
          this.opponent.buff.addBuff(24, 1);
          isTrigger = true;
        } else if (69 == id) {
          this.opponent.host.onHurt(10, 2);
          isTrigger = true;
        } else if (70 == id) {
          this.player.patchCard();
          isTrigger = true;
        } else if (82 == id || 83 == id) {
          this.host.onHeal(2);
          isTrigger = true;
        } else if (79 == id || 78 == id) {
          this.host.updateArmor(2);
          isTrigger = true;
        } else if (80 == id || 81 == id) {
          this.opponent.host.onHurt(2, 2);
          isTrigger = true;
        } else if (84 == id) {
          this.player.buff.addBuff(27, 1);
          isTrigger = true;
        } else if (86 == id) {
          this.host.onHurt(2, 2);
          isTrigger = true;
        } else if (88 == id) {
          if (game.deck.length > 0) {
            isTrigger = true;
            var element = config.get("cfg_card", game.deck[0]).element;
            for (var i = 1; i < game.deck.length; i++) if (config.get("cfg_card", game.deck[i]).element != element) {
              isTrigger = false;
              break;
            }
          }
        } else if (91 == id) {
          this.player.buff.addBuff(21, 2);
          isTrigger = true;
        } else if (93 == id) {
          if (1 == this.player.round) {
            this.scheduleOnce(function() {
              window.player.cardList[Math.floor(Math.random() * window.player.cardList.length)].getComponent("Card").discard();
              var cardId = 0;
              while (cardId <= 0) {
                var cfgId = game.getRandomCardId();
                3 == config.get("cfg_card", cfgId).quality && (cardId = cfgId);
              }
              window.player.patchCard(cardId);
            }.bind(this), .5);
            isTrigger = true;
          }
        } else if (96 == id) {
          this.opponent.buff.addBuff(26, 5);
          isTrigger = true;
        } else if (97 == id) {
          this.host.updateArmor(1);
          isTrigger = true;
        } else if (102 == id) {
          if (this.host.hp > this.host.hpMax) {
            this.host.updateArmor(this.host.hp - this.host.hpMax);
            isTrigger = true;
          }
        } else if (104 == id) {
          this.opponent.buff.addBuff(Math.floor(8 * Math.random()) + 21, 1);
          isTrigger = true;
        } else if (105 == id) {
          this.host.onHurt(1, 2);
          isTrigger = true;
        } else if (108 == id) {
          this.opponent.host.onHurt(5, 2, 6);
          isTrigger = true;
        } else if (109 == id) {
          this.opponent.host.onHurt(5, 2);
          isTrigger = true;
        } else if (110 == id) {
          this.host.onHurt(1, 2);
          this.opponent.buff.addBuff(26, 2);
          isTrigger = true;
        } else if (111 == id) {
          if (this.host.armor > 0) {
            this.opponent.host.onHurt(this.host.armor, 2);
            isTrigger = true;
          }
        } else if (114 == id) this.player.buff.addBuff(106, 1); else if (115 == id) {
          this.player.rollCount++;
          0 == window.mainLayer.roundId && window.mainLayer.hero.checkBtnRoll();
          isTrigger = true;
        } else if (116 == id) {
          this.opponent.host.onHurt(6, 2);
          isTrigger = true;
        } else if (118 == id) {
          var count = 0;
          for (var _i2 = 0; _i2 < this.opponent.cardList.length; _i2++) {
            var card = this.opponent.cardList[_i2].getComponent("Card");
            card.burn && count++;
          }
          if (count > 0) {
            this.opponent.host.onHurt(6 * count, 2);
            isTrigger = true;
          }
        } else if (119 == id) {
          this.opponent.host.onHurt(5, 2);
          isTrigger = true;
        } else if (121 == id) {
          var debuffList = [];
          for (var _i3 = 0; _i3 <= this.player.buff.buffList.length; _i3++) {
            var buffId = this.player.buff.buffList[_i3];
            buffId >= 21 && buffId <= 28 && debuffList.push(buffId);
          }
          if (debuffList.length > 0) {
            var debuffId = debuffList[Math.floor(Math.random() * debuffList.length)];
            this.player.buff.removeBuff(debuffId, this.player.buff.table[debuffId]);
            isTrigger = true;
          }
        } else if (122 == id) {
          this.opponent.host.onHurt(5, 2);
          isTrigger = true;
        } else if (123 == id) {
          if (this.host.hp > this.host.hpMax) {
            this.opponent.host.onHurt(this.host.hp - this.host.hpMax, 2);
            isTrigger = true;
          }
        } else isTrigger = true;
        isTrigger && this.doTrigger(id);
        return isTrigger;
      },
      doTrigger: function doTrigger(id) {
        for (var i = 0; i < this.itemList.length; i++) {
          var item = this.itemList[i].getComponent("Item");
          if (item.cfgId == id && !item.isRemoved) {
            item.trigger();
            break;
          }
        }
      },
      refreshItemNum: function refreshItemNum(id, num) {
        for (var i = 0; i < this.itemList.length; i++) {
          var item = this.itemList[i].getComponent("Item");
          if (item.cfgId == id) {
            item.txtCount.string = num;
            break;
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  EventLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0d029pbdspBQZQHImTjZ76I", "EventLayer");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtName: cc.Label,
        txtDesc: cc.Label,
        txtResults: [ cc.Label ],
        endPrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        this.cfgId = game.eventId;
        var cfg = config.get("cfg_event", this.cfgId);
        this.txtName.string = cfg.name;
        this.txtDesc.string = cfg.desc;
        var words = [ "\u80dc\u5229/\u5e73\u5c40\uff1a", "\u5931\u8d25\uff1a", "\u79bb\u5f00\uff1a" ];
        for (var i = 0; i < 3; i++) this.txtResults[i].string = words[i] + cfg["result" + (i + 1)];
      },
      onBattle: function onBattle() {
        window.homeLayer = null;
        cc.director.loadScene("yahtzee");
      },
      onLeave: function onLeave() {
        if ("\u65e0" != config.get("cfg_event", this.cfgId).result3) {
          var layer = cc.instantiate(this.endPrefab);
          layer.getComponent("EndYahtzeeLayer").init(2);
          window.homeLayer.node.addChild(layer);
        }
        this.close();
      },
      close: function close() {
        this.node.destroy();
        window.room.btnAlter.node.active = false;
        game.floorBeats[game.floor - 1] = true;
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  Fort: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1ae2I8ixdLDJnIKckBasJM", "Fort");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        box: cc.Sprite,
        mark: cc.Sprite,
        markCurrent: cc.Node
      },
      init: function init(id, type, isCurrent) {
        if (isCurrent) {
          cc.loader.loadRes("Texture/UI/box_fort1", cc.SpriteFrame, function(err, spriteFrame) {
            this.box.spriteFrame = spriteFrame;
          }.bind(this));
          this.markCurrent.active = true;
          this.markCurrent.runAction(cc.sequence(cc.moveBy(.35, cc.v2(0, 10)), cc.moveBy(.35, cc.v2(0, -10))).repeatForever());
        }
        if (0 == type) cc.loader.loadRes("Texture/UI/image_fort0" + id, cc.SpriteFrame, function(err, spriteFrame) {
          this.mark.spriteFrame = spriteFrame;
        }.bind(this)); else {
          cc.loader.loadRes(id > 0 ? "Texture/UI/image_fort" + id : "Texture/UI/box_fort2", cc.SpriteFrame, function(err, spriteFrame) {
            this.mark.spriteFrame = spriteFrame;
          }.bind(this));
          isCurrent || (this.mark.node.scale = .8);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f5308O6zsVOxr+EKRsyR7ba", "Game");
    "use strict";
    var config = require("Config");
    var game = {
      version: 0,
      getData: function getData(callBack) {
        if (void 0 != window.wx) wx.getStorage({
          key: "dice",
          success: function(res) {
            cc.log("getStorageSuccess:" + res.data);
            if (void 0 != res.data) {
              game.syncFromStorage(JSON.parse(res.data));
              callBack();
            } else {
              this.setDataToBase();
              callBack();
            }
          }.bind(this),
          fail: function() {
            this.setDataToBase();
            callBack();
          }.bind(this)
        }); else {
          var dt = cc.sys.localStorage.getItem("dice");
          void 0 != dt ? game.syncFromStorage(JSON.parse(dt)) : this.setDataToBase();
          callBack();
        }
      },
      setDataToBase: function setDataToBase() {
        game.heroId = 1;
        game.deck = [];
        game.cardBag = [];
        game.equip = [];
        game.hp = game.hpMax = 35;
        game.power = 0;
        game.powerMax = 20;
        game.heroPos = 2;
        game.exp = 0;
        game.level = 1;
        game.character = 1;
        game.castle = 1;
        game.floor = 1;
        game.roomType = 0;
        game.copper = 50;
        game.debuff = 0;
        game.shopIds = [];
        game.eventIds = [];
        game.historyPath = [];
        game.historyChoose = [ 0 ];
        game.floorBeats = [];
        game.specialRoomIds = [];
        game.monsterBeats = [];
        game.discountCard = game.discountItem = -1;
        game.itemEffect = {
          feather: 0,
          vase: 0,
          flagon: 0,
          pen: 0,
          vip1: false,
          vip2: false
        };
        game.saveData();
      },
      syncFromStorage: function syncFromStorage(dt) {
        var list = [ "deck", "cardBag", "equip", "hp", "hpMax", "power", "powerMax", "heroPos", "stayRoom", "newRoom", "level", "floor", "castle", "roomType", "copper", "debuff", "shopIds", "eventIds", "floorCfg", "historyPath", "historyChoose", "discountCard", "discountItem", "itemEffect", "specialRoomIds", "exp", "monsterBeats" ];
        for (var i = 0; i < list.length; i++) game[list[i]] = dt[list[i]];
      },
      saveData: function saveData() {
        game.version++;
        void 0 != window.wx ? wx.setStorage({
          key: "dice",
          data: JSON.stringify(game),
          success: function success() {}
        }) : cc.sys.localStorage.setItem("dice", JSON.stringify(game));
      },
      getItem: function getItem(cfgId) {
        if (71 == cfgId) game.copper += 30; else if (87 == cfgId) for (var i = 0; i < 2; i++) game.getItem(game.getNewItemId(0, 2)); else game.equip.push(cfgId);
        if (10 == cfgId) game.itemEffect.feather = 1; else if (28 == cfgId) game.itemEffect.vase += 2; else if (29 == cfgId) game.itemEffect.flagon += 2; else if (40 == cfgId) {
          game.hpMax += 5;
          game.hp += 5;
        } else if (41 == cfgId) {
          game.hpMax += 10;
          game.hp += 10;
        } else if (46 == cfgId) game.itemEffect.vip1 = true; else if (47 == cfgId) game.itemEffect.vip2 = true; else if (72 == cfgId) {
          game.copper += 50;
          game.hpMax += 10;
          game.hp += 10;
        } else if (74 == cfgId) game.itemEffect.pen += 3; else if (84 == cfgId) for (var _i = 0; _i < 3; _i++) game.getItem(game.getNewItemId(0)); else if (92 == cfgId) {
          game.hpMax = Math.max(game.hpMax - 8, 1);
          game.hp = Math.min(game.hp, game.hpMax);
        } else if (95 == cfgId) {
          game.hpMax += 10;
          game.hp = game.hpMax;
        } else if (96 == cfgId) {
          game.hpMax = Math.max(game.hpMax - 10, 1);
          game.hp = Math.min(game.hp, game.hpMax);
        } else if (105 == cfgId) {
          game.hpMax += 20;
          game.hp += 20;
        } else 106 == cfgId && (game.powerMax += 10);
        if (94 != cfgId && game.equip.indexOf(94) >= 0) {
          game.hpMax += 5;
          game.hp += 5;
        }
        window.homeLayer && window.homeLayer.refreshHeroData();
      },
      getCard: function getCard(cfgId) {
        var deckCount = 2 == game.heroId ? 4 : 6;
        if (game.deck.length < deckCount) game.deck.push(cfgId); else {
          game.cardBag.push(cfgId);
          game.newCard = true;
          window.homeLayer && window.homeLayer.refreshHeroData();
        }
      },
      getNewItemId: function getNewItemId(type, quality) {
        var itemId = 0;
        while (itemId <= 0) {
          var id = Math.floor(Math.random() * Object.keys(config.jsonTable["cfg_item"]).length) + 1;
          var index = game.equip.indexOf(id);
          index < 0 && (0 == type && config.get("cfg_item", id).get <= 1 || 1 == type && 0 == config.get("cfg_item", id).get || 2 == type) && (quality ? config.get("cfg_item", id).quality == quality && (itemId = id) : itemId = id);
        }
        return itemId;
      },
      getNewCardId: function getNewCardId(quality, isInit) {
        var cardId = 0;
        while (cardId <= 0) {
          var id = game.getRandomCardId(null, isInit);
          game.deck.indexOf(id) < 0 && game.cardBag.indexOf(id) < 0 && (quality ? config.get("cfg_card", id).quality == quality && (cardId = id) : cardId = id);
        }
        return cardId;
      },
      getRandomCardId: function getRandomCardId(element, isInit) {
        var cardId = 0;
        while (cardId <= 0) {
          var id = Math.floor(Math.random() * Object.keys(config.jsonTable["cfg_card"]).length) + 1;
          config.get("cfg_card", id).get == (isInit ? 2 : 1) && (element ? config.get("cfg_card", id).element == element && (cardId = id) : cardId = id);
        }
        return cardId;
      },
      getNewMonsterId: function getNewMonsterId(level, quality) {
        var monsterId = 0;
        while (monsterId <= 0) {
          var id = Math.floor(Math.random() * Object.keys(config.jsonTable["cfg_monster"]).length) + 1;
          var index = game.monsterBeats.indexOf(id);
          index < 0 && config.get("cfg_monster", id).level == level && config.get("cfg_monster", id).type == quality && (monsterId = id);
        }
        return monsterId;
      },
      analysisDesc: function analysisDesc(str, atkColor) {
        var s = "";
        var status = 0;
        var temp = "";
        var imgs = {
          1: "fire",
          2: "water",
          3: "wind",
          4: "earth",
          5: "light",
          6: "dark",
          7: atkColor ? "atk2" : "atk",
          9: "suck",
          11: "armor",
          12: "heal",
          13: "dodge",
          14: "power",
          15: "heart",
          21: "burn",
          22: "freeze",
          23: "frail",
          24: "weak",
          25: "silence",
          26: "poison",
          27: "curse",
          28: "lock",
          29: "atkback"
        };
        var colors = {
          1: "FF3832",
          2: "2CB4FF",
          3: "00F776",
          4: "FF9652",
          5: "FFFB4B",
          6: "BF7FE4",
          7: atkColor || "FFFFFF",
          9: "FF5567",
          11: "42EBFF",
          12: "98F700",
          13: "FFF830",
          14: "FFFB4B",
          15: "FF5567",
          21: "FF5567",
          22: "42EBFF",
          23: "FF5567",
          24: "D68F5E",
          25: "42EBFF",
          26: "BF7FE4",
          27: "B1B1B1",
          28: "E2BD6D",
          29: "FF5567"
        };
        for (var i = 0; i < str.length; i++) if ("#" == str[i]) if (0 == status) {
          status = 1;
          temp = "";
          s += "<img src='";
        } else {
          s += imgs[parseInt(temp)];
          s += "'/>";
          status = 0;
        } else if ("[" == str[i]) {
          temp = "";
          if (0 == status) {
            status = 2;
            s += "<color=#";
          }
        } else if ("]" == str[i]) if ("" != temp) {
          s += colors[parseInt(temp)];
          s += ">";
          status = -1;
        } else {
          status = 0;
          s += "</c>";
        } else status <= 0 ? str[i] >= "A" && str[i] <= "F" ? s += " <img src='dice" + (str[i].charCodeAt() - 64) + "'/> " : s += str[i] : temp += str[i];
        return s;
      }
    };
    module.exports = game;
    cc._RF.pop();
  }, {
    Config: "Config"
  } ],
  HelloWorld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ccc53972FhL0qaXGUz6Mc6F", "HelloWorld");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        bg: cc.Node,
        hero: cc.Node,
        txtFloor: cc.Label,
        roomPrefab: cc.Prefab,
        stripHp: cc.ProgressBar,
        txtHp: cc.Label,
        stripExp: cc.ProgressBar,
        txtExp: cc.Label,
        txtName: cc.Label,
        txtLevel: cc.Label,
        txtCopper: cc.Label,
        txtEquipCount: cc.Label,
        markRed: cc.Node,
        layerNode: cc.Node,
        campPrefab: cc.Prefab,
        treasurePrefab: cc.Prefab,
        eventPrefab: cc.Prefab,
        bagPrefab: cc.Prefab,
        equipPrefab: cc.Prefab,
        completePrefab: cc.Prefab,
        shopPrefab: cc.Prefab,
        mapPrefab: cc.Prefab,
        lvUpPrefab: cc.Prefab,
        btnMap: cc.Node,
        btnEquip: cc.Node,
        btnDeck: cc.Node
      },
      onLoad: function onLoad() {
        window.homeLayer = this;
        1 == game.floor && 1 == game.castle && this.initGameConfig();
        this.createRoom();
        this.refreshHeroData();
        game.levelUp && this.scheduleOnce(this.openLvUp, .3);
      },
      createRoom: function createRoom() {
        var room = cc.instantiate(this.roomPrefab);
        this.bg.addChild(room);
        this.room = room;
        this.hero.parent = room;
        if (1 == game.floor && 1 == game.castle) {
          room.getComponent("Room").init(true);
          room.getComponent("Room").initHero();
        } else room.getComponent("Room").init(false);
      },
      changeRoom: function changeRoom(pos) {
        var room = cc.instantiate(this.roomPrefab);
        this.bg.addChild(room);
        room.getComponent("Room").init(true);
        var tg = cc.v2();
        if (0 == pos) {
          room.position = cc.v2(0, 1450);
          tg = cc.v2(0, -1450);
        } else if (1 == pos) {
          room.position = cc.v2(1080, 0);
          tg = cc.v2(-1080, 0);
        } else if (2 == pos) {
          room.position = cc.v2(0, -1450);
          tg = cc.v2(0, 1450);
        } else if (3 == pos) {
          room.position = cc.v2(-1080, 0);
          tg = cc.v2(1080, 0);
        }
        var preRoom = this.room;
        preRoom.runAction(cc.sequence(cc.moveBy(.3, tg), cc.callFunc(function() {
          this.hero.parent = room;
          preRoom.destroy();
        }.bind(this))));
        room.runAction(cc.sequence(cc.moveBy(.3, tg), cc.callFunc(function() {
          this.room = room;
          room.getComponent("Room").initHero();
        }.bind(this))));
      },
      openAlter: function openAlter() {
        if (2 == game.roomType) {
          var layer = cc.instantiate(this.campPrefab);
          this.node.addChild(layer);
        } else if (3 == game.roomType || game.roomType >= 6) {
          var _layer = cc.instantiate(this.treasurePrefab);
          _layer.getComponent("TreasureLayer").init(7 == game.roomType);
          this.node.addChild(_layer);
        } else if (4 == game.roomType) {
          var _layer2 = cc.instantiate(this.eventPrefab);
          this.node.addChild(_layer2);
        } else if (5 == game.roomType) {
          var _layer3 = cc.instantiate(this.shopPrefab);
          this.layerNode.addChild(_layer3);
        }
      },
      refreshHeroData: function refreshHeroData() {
        this.txtHp.string = game.hp + "/" + game.hpMax;
        this.stripHp.progress = game.hp / game.hpMax;
        var maxList = [ 7, 15, 25, 37, 51, 67, 150 ];
        var expMax = maxList[game.level - 1];
        this.txtExp.string = game.exp + "/" + expMax;
        this.stripExp.progress = game.exp / expMax;
        this.txtLevel.string = "Lv." + game.level;
        this.txtCopper.string = game.copper;
        this.txtEquipCount.string = game.equip.length;
        this.markRed.active = game.newCard;
      },
      openMap: function openMap() {
        if (window.mapLayer) window.mapLayer.mask.opacity >= 180 && window.mapLayer.close(); else {
          var layer = cc.instantiate(this.mapPrefab);
          this.layerNode.addChild(layer);
        }
      },
      openCardBag: function openCardBag() {
        if (window.bagLayer) window.bagLayer.mask.active && window.bagLayer.close(); else {
          var layer = cc.instantiate(this.bagPrefab);
          this.layerNode.addChild(layer);
        }
      },
      openEquip: function openEquip() {
        if (window.equipLayer) window.equipLayer.mask.active && window.equipLayer.close(); else {
          var layer = cc.instantiate(this.equipPrefab);
          this.layerNode.addChild(layer);
        }
      },
      openLvUp: function openLvUp() {
        var layer = cc.instantiate(this.lvUpPrefab);
        this.node.addChild(layer);
      },
      openComplete: function openComplete() {
        var layer = cc.instantiate(this.completePrefab);
        this.node.addChild(layer);
      },
      initDeck: function initDeck() {
        var cardInitCount = 2 == game.heroId ? 2 : 3;
        if (game.deck.length + game.cardBag.length <= cardInitCount) while (game.deck.length < cardInitCount) {
          var cfgId = game.getNewCardId(null, true);
          game.getCard(cfgId);
        }
      },
      initGameConfig: function initGameConfig() {
        this.initDeck();
        game.eventIds = [];
        for (var i = 0; i < 17; i++) {
          var index = Math.floor(Math.random() * (game.eventIds.length + 1));
          game.eventIds.splice(index, 0, i + 1);
        }
        game.specialRoomIds = [ 3, 4 ];
        var lists = [ [ 2, 4, 5 ], [ 2, 3, 4, 4, 5 ], [ 2, 3, 4, 4 ] ];
        for (var _i = 0; _i < 3; _i++) {
          var list = lists[_i];
          for (var j = list.length - 1; j >= 0; j--) {
            var _index = Math.floor(Math.random() * list.length);
            game.specialRoomIds.push(list[_index]);
            list.splice(_index, 1);
          }
        }
        game.specialRoomIds.push(5);
        game.floorQuests = [ [], [], [] ];
        for (var _i2 = 0; _i2 < 3; _i2++) for (var _j = 0; _j < 13; _j++) this.initFloorConfig(_i2, _j);
      },
      initFloorConfig: function initFloorConfig(castle, floor) {
        var list = [];
        if (0 == floor) list = [ 1 ]; else if (4 == floor) list = [ 6, 6 ]; else if (10 == floor) list = [ 7 ]; else if (11 == floor) list = castle < 2 ? [ 0 ] : [ 7 ]; else if (12 == floor) {
          if (castle < 2) return;
          list = [ 0 ];
        } else if (2 == floor || 6 == floor || 8 == floor) list = Math.random() < .4 ? [ 1, 1, 1 ] : [ 1, 1 ]; else {
          var type = game.specialRoomIds.shift();
          list = Math.random() < .3 ? [ type, 1, 1 ] : [ type, 1 ];
        }
        game.floorQuests[castle].push(list);
      },
      gotoEdit: function gotoEdit() {
        cc.director.loadScene("edit");
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  Hero: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7311fX1RYNN1bDgBGcTZsee", "Hero");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        stripHp: cc.ProgressBar,
        barHp: cc.Node,
        txtHp: cc.Label,
        stripPower: cc.ProgressBar,
        txtPower: cc.Label,
        boxBuff: cc.Node,
        txtNum: cc.Node,
        boxArmor: cc.Node,
        txtArmor: cc.Label,
        txtBuff: cc.RichText,
        boxEquip: cc.Node,
        skillPrefab: cc.Prefab,
        head: cc.Node,
        skillNode: cc.Node,
        txtDice: cc.Label,
        txtExDice: cc.Label
      },
      onLoad: function onLoad() {
        this.player = this.getComponent("Player");
        this.buff = this.getComponent("Buff");
        this.equip = this.getComponent("Equip");
      },
      init: function init() {
        this.btnEnd = window.mainLayer.btnEnd;
        this.btnRoll = window.mainLayer.btnRoll;
        this.txtRollCount = window.mainLayer.txtRollCount;
        this.deck = game.deck.concat();
        this.player.init(0);
        this.hpMax = game.hpMax;
        this.hp = game.hp;
        this.power = game.power;
        this.powerMax = game.powerMax;
        this.armor = 0;
        this.rollabled = true;
        this.refreshStrip();
        this.initSkills();
      },
      startRound: function startRound() {
        this.btnEnd.runAction(cc.sequence(cc.delayTime(.8), cc.moveTo(.2, cc.v2(-275, 140))));
      },
      endRound: function endRound() {
        for (var i = 0; i < 2; i++) this.btnSkills[i].getComponent("Skill").abled = true;
        this.checkSkills();
        this.btnEnd.runAction(cc.moveTo(.2, cc.v2(-475, 140)));
        this.player.rollCount = 0;
        this.checkBtnRoll();
      },
      refreshStrip: function refreshStrip() {
        this.txtPower.string = this.power + "/" + this.powerMax;
        this.stripPower.progress = this.power / this.powerMax;
        this.txtHp.string = this.hp + "/" + this.hpMax;
        this.stripHp.progress = this.hp / this.hpMax;
      },
      onHurt: function onHurt(dmg, source, element) {
        if (window.mainLayer.gameOver) return;
        var preHp = this.hp;
        element = element || 7;
        this.player.onHurt(dmg, source, element);
        if (this.hp <= 0) {
          this.hp = 0;
          window.mainLayer.showEnd(1);
        }
        preHp > this.hp && this.addPower(preHp - this.hp);
      },
      onHeal: function onHeal(hp) {
        this.equip.checkWithTrigger(76) && (hp = Math.floor(1.5 * hp));
        this.player.onHeal(hp);
        this.player.assertHpChange("+" + hp, 1);
        this.hp = Math.min(this.hp, this.hpMax);
        this.txtHp.string = this.hp + "/" + this.hpMax;
        this.stripHp.progress = this.hp / this.hpMax;
      },
      addPower: function addPower(power) {
        this.power += power;
        this.power = Math.min(this.power, this.powerMax);
        this.txtPower.string = this.power + "/" + this.powerMax;
        this.stripPower.progress = this.power / this.powerMax;
        this.checkSkills();
      },
      updateArmor: function updateArmor(num) {
        this.armor += num;
        if (this.armor > 0) {
          this.boxArmor.active = true;
          this.txtArmor.string = this.armor;
          this.stripHp.node.color = cc.color(24, 136, 176);
          this.barHp.color = cc.color(92, 214, 255);
        } else {
          this.armor = 0;
          this.boxArmor.active = false;
          this.stripHp.node.color = cc.color(172, 45, 56);
          this.barHp.color = cc.color(252, 94, 108);
        }
        num > 0 && this.player.anim.show(11);
      },
      initSkills: function initSkills() {
        this.btnSkills = [];
        for (var i = 0; i < 2; i++) {
          var skill = cc.instantiate(this.skillPrefab);
          skill.position = cc.v2(0 == i ? 127 : 285, 31);
          skill.getComponent("Skill").init(i);
          this.skillNode.addChild(skill);
          this.btnSkills.push(skill);
        }
      },
      checkSkills: function checkSkills() {
        for (var i = 0; i < 2; i++) this.btnSkills[i].getComponent("Skill").check();
      },
      checkBtnRoll: function checkBtnRoll(isReroll) {
        var enabled = false;
        if (this.player.rollCount > 0) if (this.player.cardList.length > 0) enabled = true; else if (this.player.chestList) for (var i = 0; i < 3; i++) if (this.player.chestList[i]) {
          enabled = true;
          break;
        }
        if (enabled != this.rollabled) {
          this.rollabled = enabled;
          enabled ? this.btnRoll.runAction(cc.moveTo(.15, cc.v2(310, 140))) : this.btnRoll.runAction(cc.moveTo(.15, cc.v2(425, 140)));
        } else enabled && isReroll && this.btnRoll.runAction(cc.sequence(cc.moveTo(.15, cc.v2(425, 140)), cc.moveTo(.15, cc.v2(310, 140))));
        this.txtRollCount.string = this.player.rollCount;
      },
      doShake: function doShake(id) {
        var colors = {
          1: "EA6769",
          2: "30EEFF",
          3: "24A63B",
          4: "978535",
          5: "B98D24",
          6: "5A688F",
          7: "B8565D",
          8: "B8565D",
          9: "B8565D",
          21: "EA6769",
          22: "30EEFF",
          23: "986951",
          24: "70821F",
          25: "52E3A2",
          26: "6E2363",
          27: "486545",
          28: "A17B2A",
          29: "9C434A"
        };
        if (colors[id]) {
          this.head.color = cc.Color.WHITE.fromHEX("#" + colors[id]);
          window.mainLayer.camera.stopAllActions();
          window.mainLayer.camera.runAction(cc.sequence(cc.moveTo(.05, cc.v2(5, 5)), cc.moveTo(.1, cc.v2(-5, -5)), cc.moveTo(.08, cc.v2(0, 0)), cc.callFunc(function() {
            window.mainLayer.camera.position = cc.v2(0, 0);
            this.head.color = cc.Color.WHITE;
          }.bind(this))));
        }
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  ItemCollection: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab80d9GfjVBrqTZMJrGxGF9", "ItemCollection");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtName: cc.Label,
        txtQuality: cc.Label,
        txtDesc: cc.RichText,
        icon: cc.Sprite,
        boxHead: cc.Sprite
      },
      init: function init(cfgId) {
        var cfg = config.get("cfg_item", cfgId);
        var colorList = [ cc.color(85, 229, 255), cc.color(255, 128, 242), cc.color(255, 154, 73) ];
        var words = [ "\u666e\u901a", "\u7a00\u6709", "\u53f2\u8bd7" ];
        this.txtName.string = cfg.name;
        var desc = game.analysisDesc(cfg.desc1);
        var count = -1;
        10 == cfgId ? count = game.itemEffect.feather > 0 ? 1 : 0 : 28 == cfgId ? count = game.itemEffect.vase : 29 == cfgId ? count = game.itemEffect.flagon : 74 == cfgId && (count = game.itemEffect.pen);
        count >= 0 && (desc += "<color=#EBC82E>  (\u5269\u4f59\u6b21\u6570" + count + ")</c>");
        this.txtDesc.string = desc;
        this.txtQuality.string = words[cfg.quality - 1];
        this.txtQuality.node.color = colorList[cfg.quality - 1];
        cc.loader.loadRes("Texture/equip/" + cfgId, cc.SpriteFrame, function(err, spriteFrame) {
          this.icon.spriteFrame = spriteFrame;
        }.bind(this));
        cc.loader.loadRes("Texture/UI/box_icon" + cfg.quality, cc.SpriteFrame, function(err, spriteFrame) {
          this.boxHead.spriteFrame = spriteFrame;
        }.bind(this));
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  ItemCommodity: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f3b0dTDz+lCm6po5gYe0nnB", "ItemCommodity");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtName: cc.Label,
        txtName2: cc.Label,
        icon: cc.Sprite,
        bg: cc.Sprite,
        txtDesc: cc.RichText,
        boxIcon: cc.Sprite
      },
      init: function init(cfgId) {
        var cfg = config.get("cfg_item", cfgId);
        this.txtName.string = this.txtName2.string = cfg.name;
        this.txtDesc.string = game.analysisDesc(cfg.desc1);
        cc.loader.loadRes("Texture/equip/" + cfgId, cc.SpriteFrame, function(err, spriteFrame) {
          this.icon.spriteFrame = spriteFrame;
        }.bind(this));
        cc.loader.loadRes("Texture/UI/box_item" + cfg.quality, cc.SpriteFrame, function(err, spriteFrame) {
          this.bg.spriteFrame = spriteFrame;
        }.bind(this));
        cc.loader.loadRes("Texture/UI/box_icon" + cfg.quality, cc.SpriteFrame, function(err, spriteFrame) {
          this.boxIcon.spriteFrame = spriteFrame;
        }.bind(this));
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  Item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3a4a3eddFJBpLM6kSrb9Bn8", "Item");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        icon: cc.Sprite,
        iconBtn: cc.Button,
        boxNum: cc.Node,
        txtCount: cc.Label,
        tip: cc.Node,
        txtDesc: cc.RichText,
        box: cc.Node
      },
      init: function init(cfgId, equip) {
        this.cfgId = cfgId;
        this.cfg = config.get("cfg_item", cfgId);
        this.equip = equip;
        cc.loader.loadRes("Texture/equip/" + cfgId, cc.SpriteFrame, function(err, spriteFrame) {
          this.icon.spriteFrame = spriteFrame;
        }.bind(this));
        43 == cfgId && (this.boxNum.active = true);
      },
      trigger: function trigger() {
        this.action && this.node.stopAction(this.action);
        this.action = cc.sequence(cc.scaleTo(.25, 1.5), cc.scaleTo(.25, 1), cc.callFunc(function() {
          this.action = null;
          1 == this.cfg.num && this.doDisabled();
        }.bind(this)));
        this.icon.node.runAction(this.action);
      },
      doDisabled: function doDisabled() {
        this.iconBtn.enableAutoGrayEffect = true;
      },
      openTip: function openTip() {
        if (1 == this.equip.index) return;
        if (window.mainLayer.equipTip) {
          if (window.mainLayer.equipTip == this) {
            this.hideTip();
            return;
          }
          window.mainLayer.equipTip.hideTip();
        }
        this.tip.active = true;
        window.mainLayer.equipTip = this;
        var colors = [ "5CC7FF", "C262FF", "FF9231" ];
        this.txtDesc.string = "<color=#" + colors[this.cfg.quality - 1] + ">" + this.cfg.name + "\uff1a</c>" + game.analysisDesc(this.cfg.desc1);
        this.node.x < -220 ? this.box.x = -220 - this.node.x : this.node.x > 220 && (this.box.x = 220 - this.node.x);
        this.scheduleOnce(this.hideTip, 5);
      },
      hideTip: function hideTip() {
        this.unscheduleAllCallbacks();
        this.tip.active = false;
        window.mainLayer.equipTip = null;
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  LevelUpLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bdb92ld599JPZMXSf9CLd3t", "LevelUpLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        btnClose: cc.Node,
        cardPrefab: cc.Prefab,
        itemPrefab: cc.Prefab,
        txtSkill: cc.Label,
        boxReward: cc.Node,
        btns: [ cc.Node ]
      },
      onLoad: function onLoad() {
        this.type = 3;
        if (3 == game.level) {
          this.txtSkill.node.active = true;
          var words = [ "\u53cc\u6253", "\u5927\u6ee1\u8d2f" ];
          this.txtSkill.string = "\u6012\u6c14\u6280\uff1a" + words[game.heroId - 1];
          this.btns[0].active = this.btns[1].active = false;
        } else if (5 == game.level || 7 == game.level) {
          this.type = 2;
          this.initItems();
        } else {
          this.type = 1;
          this.initCards();
        }
      },
      initCards: function initCards() {
        this.btnClose.active = false;
        this.itemIdList = [];
        this.items = [];
        var cfgId1 = game.getNewCardId();
        this.itemIdList.push(cfgId1);
        var cfgId2 = 0;
        while (cfgId2 <= 0) {
          var id = game.getNewCardId();
          id != cfgId1 && (cfgId2 = id);
        }
        this.itemIdList.push(cfgId2);
        for (var i = 0; i < 2; i++) {
          var card = cc.instantiate(this.cardPrefab);
          card.getComponent("CardCollection").init(this.itemIdList[i]);
          card.position = cc.v2(0 == i ? -160 : 160, 40);
          this.boxReward.addChild(card);
          this.items.push(card);
        }
      },
      initItems: function initItems() {
        this.btnClose.active = false;
        this.itemIdList = [];
        this.items = [];
        var cfgId1 = game.getNewItemId(0);
        this.itemIdList.push(cfgId1);
        var cfgId2 = 0;
        while (cfgId2 <= 0) {
          var id = game.getNewItemId(0);
          id != cfgId1 && (cfgId2 = id);
        }
        this.itemIdList.push(cfgId2);
        for (var i = 0; i < 2; i++) {
          var card = cc.instantiate(this.itemPrefab);
          card.getComponent("ItemCommodity").init(this.itemIdList[i]);
          card.position = cc.v2(0 == i ? -160 : 160, 40);
          this.boxReward.addChild(card);
          this.items.push(card);
        }
      },
      choose: function choose(e, index) {
        1 == this.type ? game.getCard(this.itemIdList[index]) : game.getItem(this.itemIdList[index]);
        this.items[1 - index].destroy();
        this.items[index].runAction(cc.moveTo(.2, cc.v2(0, 40)));
        this.btns[0].active = this.btns[1].active = false;
        this.btnClose.active = true;
      },
      close: function close() {
        game.levelUp = false;
        this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  LoseLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "83cb32zixhKjK+z7d0tg7ub", "LoseLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {},
      restart: function restart() {
        if (game.floor > 1) {
          game.floor--;
          var floorCfg = game.historyPath[game.floor - 1];
          var pos = floorCfg.indexOf(-2);
          pos >= 0 && (game.heroPos = pos);
          game.floor > 1 ? game.roomType = game.historyChoose[game.floor - 1] : game.roomType = 0;
          -1 == game.itemEffect.feather && (game.itemEffect.feather = 1);
        }
        cc.director.loadScene("helloworld");
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  MainLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb09czDdDRJ2K8f7XUVtYKQ", "MainLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        heroPrefab: cc.Prefab,
        enemyPrefab: cc.Prefab,
        enemyNode: cc.Node,
        endPrefab: cc.Prefab,
        losePrefab: cc.Prefab,
        editEndPrefab: cc.Prefab,
        btnEnd: cc.Node,
        btnRoll: cc.Node,
        boxCardHero: cc.Node,
        boxDiceHero: cc.Node,
        boxCardEnemy: cc.Node,
        boxDiceEnemy: cc.Node,
        board: cc.Node,
        camera: cc.Node,
        txtRollCount: cc.Label,
        bg: cc.Node
      },
      onLoad: function onLoad() {
        window.mainLayer = this;
        this.gameOver = false;
        this.bg.on(cc.Node.EventType.TOUCH_START, this.hideTip, this);
      },
      start: function start() {
        var hero = cc.instantiate(this.heroPrefab);
        hero.position = cc.v2(0, 115 - cc.winSize.height / 2);
        this.node.addChild(hero);
        this.hero = hero.getComponent("Hero");
        var enemy = cc.instantiate(this.enemyPrefab);
        enemy.position = cc.v2(0, cc.winSize.height / 2 - 300);
        this.enemyNode.addChild(enemy);
        this.enemy = enemy.getComponent("Enemy");
        this.hero.init();
        this.enemy.init();
        this.roundId = 1;
        this.scheduleOnce(function() {
          this.doRound();
        }.bind(this), .1);
      },
      doRound: function doRound() {
        this.roundId = 1 - this.roundId;
        window.player = 0 == this.roundId ? this.hero.player : this.enemy.player;
        window.host = window.player.host;
        window.opponent = 1 == this.roundId ? this.hero.player : this.enemy.player;
        window.player.startRound();
      },
      showEnd: function showEnd(hostId) {
        this.gameOver = true;
        if (game.editCfg) {
          var layer = cc.instantiate(this.editEndPrefab);
          this.node.addChild(layer);
        } else this.scheduleOnce(function() {
          if (0 == hostId) {
            var _layer = cc.instantiate(this.endPrefab);
            this.node.addChild(_layer);
          } else {
            var _layer2 = cc.instantiate(this.losePrefab);
            this.node.addChild(_layer2);
          }
        }.bind(this), .5);
      },
      roll: function roll() {
        this.hero.player.roll();
      },
      endRound: function endRound() {
        this.hero.player.endRound();
      },
      hideTip: function hideTip() {
        this.equipTip && this.equipTip.hideTip();
        this.buffTip && this.buffTip.hideTip();
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  MapLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2be16dXDepLLbZP42Rqq+om", "MapLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        scroll: cc.ScrollView,
        content: cc.Node,
        fortPrefab: cc.Prefab,
        mask: cc.Node,
        markBoss: cc.Node,
        lineNode: cc.Node,
        line: cc.Node,
        txtTitle: cc.Label,
        view: cc.Node,
        top: cc.Node,
        bottom: cc.Node,
        box: cc.Node,
        btnBack: cc.Node
      },
      onLoad: function onLoad() {
        window.mapLayer = this;
        var nums = [ "\u4e00", "\u4e8c", "\u4e09" ];
        this.txtTitle.string = "\u53e4\u5821" + nums[game.castle - 1] + "\u5c42";
        window.bagLayer ? window.bagLayer.close() : window.equipLayer && window.equipLayer.close();
        this.box.opacity = 0;
        this.mask.opacity = 0;
        this.mask.runAction(cc.sequence(cc.fadeTo(.2, 180), cc.callFunc(function() {
          this.openMap();
        }.bind(this))));
        this.drawMap();
      },
      openMap: function openMap() {
        this.box.opacity = 255;
        this.winHeight = cc.winSize.height / cc.winSize.width * 750;
        this.bottom.y = -this.winHeight / 2 + 330;
        this.bottom.runAction(cc.sequence(cc.delayTime(.1), cc.moveBy(.05, cc.v2(0, -150)), cc.moveBy(.1, cc.v2(0, -50)), cc.moveBy(.1, cc.v2(0, 15))));
        this.top.y = -this.winHeight / 2 + 435;
        this.top.runAction(cc.sequence(cc.delayTime(.05), cc.moveTo(.3, cc.v2(0, this.winHeight / 2 - 129)), cc.moveBy(.1, cc.v2(0, 20)), cc.moveBy(.1, cc.v2(0, -10))));
        this.view.height = 50;
        this.view.y = (this.bottom.y + this.top.y) / 2 - 9;
        this.btnBack.opacity = 0;
        this.btnBack.y -= 200;
        this.btnBack.runAction(cc.sequence(cc.delayTime(.2), cc.spawn(cc.moveBy(.2, cc.v2(0, 200)), cc.fadeIn(.1))));
        this.frame = 0;
        this.schedule(this.updateFrame, 0);
      },
      updateFrame: function updateFrame() {
        this.frame++;
        this.view.height = this.top.y - this.bottom.y - 65;
        this.view.y = (this.bottom.y + this.top.y) / 2 - 9;
      },
      drawMap: function drawMap() {
        var fort = cc.instantiate(this.fortPrefab);
        fort.getComponent("Fort").init(0, 1, 1 == game.floor);
        fort.position = cc.v2(0, 66);
        this.content.addChild(fort);
        var pos = 0;
        var length = game.historyPath.length;
        if (length >= 12) {
          this.markBoss.active = false;
          length = 12;
        }
        for (var i = 0; i < length; i++) {
          var path = game.historyPath[i];
          var select = 0;
          for (var j = 0; j < 4; j++) if (null != game.historyChoose[i + 1]) {
            if (path[j] == game.historyChoose[i + 1]) {
              select = j;
              break;
            }
          } else if (path[j] > 0) {
            select = j;
            break;
          }
          var roomId = path[select];
          if (roomId > 0 && (11 != game.historyPath.length || 10 != i)) {
            var offsetList = [ -1, 0, 1 ];
            var posList = [];
            for (var _j = 0; _j < 3; _j++) {
              var tgPos = pos + offsetList[_j];
              var range = i < 7 ? 4 : 10 - i;
              tgPos >= -range && tgPos <= range && posList.push(tgPos);
            }
            var taPos = posList[Math.floor(Math.random() * posList.length)];
            i < game.historyPath.length - 1 && this.createLine(pos, taPos, i);
            pos = taPos;
            var _fort = cc.instantiate(this.fortPrefab);
            _fort.getComponent("Fort").init(roomId, i == game.historyPath.length - 1 ? 2 : 1, i == game.floor - 2);
            _fort.position = cc.v2(70 * pos, 198 + 132 * i);
            this.content.addChild(_fort);
            var deltaList = [ -1, 1 ];
            for (var _j2 = 2; _j2 >= 0; _j2--) {
              var sum = deltaList[_j2] + pos;
              (sum < -4 || sum > 4) && deltaList.splice(_j2, 1);
            }
            for (var _j3 = 0; _j3 < 4; _j3++) {
              var fortId = path[_j3];
              if (_j3 != select && fortId > 0) {
                var index = Math.floor(Math.random() * deltaList.length);
                var delta = deltaList[index];
                var x = pos + delta;
                deltaList.splice(index, 1);
                var _fort2 = cc.instantiate(this.fortPrefab);
                _fort2.getComponent("Fort").init(fortId, i == game.historyPath.length - 1 ? 2 : 0);
                _fort2.position = cc.v2(70 * x, 198 + 132 * i);
                this.content.addChild(_fort2);
                if (-1 == delta || 1 == delta) {
                  var _sum = 2 * delta + pos;
                  _sum >= -4 && _sum <= 4 && deltaList.push(2 * delta);
                }
              }
            }
          }
        }
        var percent = 0;
        game.historyPath.length >= 9 ? percent = 1 : game.historyPath.length > 4 && (percent = (game.historyPath.length - 4) / 5);
        this.scroll.scrollToPercentVertical(percent, .3);
      },
      createLine: function createLine(prePos, newPos, index) {
        var line = cc.instantiate(this.line);
        line.position = cc.v2(70 * prePos, 66 + 132 * index);
        this.lineNode.addChild(line);
        var lineId = 0;
        var scaleX = 1;
        if (prePos == newPos) {
          lineId = Math.floor(2 * Math.random()) + 1;
          scaleX = Math.random() < .5 ? 1 : -1;
        } else {
          lineId = Math.floor(3 * Math.random()) + 3;
          scaleX = newPos > prePos ? 1 : -1;
        }
        cc.loader.loadRes("Texture/UI/image_load" + lineId, cc.SpriteFrame, function(err, spriteFrame) {
          if (line) {
            line.scaleX = scaleX;
            line.x -= 10 * scaleX;
            line.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          }
        }.bind(this));
      },
      close: function close() {
        this.btnBack.runAction(cc.spawn(cc.moveBy(.2, cc.v2(0, -300)), cc.fadeIn(.3)));
        this.bottom.runAction(cc.sequence(cc.moveBy(.1, cc.v2(0, 15)), cc.moveBy(.1, cc.v2(0, 50)), cc.moveTo(.1, cc.v2(0, -this.winHeight / 2 + 280))));
        this.top.runAction(cc.sequence(cc.moveBy(.1, cc.v2(0, 10)), cc.moveBy(.1, cc.v2(0, -20)), cc.moveTo(.2, cc.v2(0, -this.winHeight / 2 + 385))));
        this.mask.runAction(cc.sequence(cc.delayTime(.2), cc.fadeOut(.2)));
        this.box.runAction(cc.sequence(cc.delayTime(.4), cc.moveBy(.15, cc.v2(0, -400)), cc.callFunc(function() {
          this.node.destroy();
          window.mapLayer = null;
          window.homeLayer.btnMap.runAction(cc.sequence(cc.scaleTo(.1, 1.1), cc.scaleTo(.1, 1)));
        }.bind(this))));
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  Opening: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "52880hyyK1GjLw1tAGJFFaD", "Opening");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        endPrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        this.login();
      },
      login: function login() {
        config.load(function() {
          game.setDataToBase();
          this.loadRes();
          this.gotoMain();
        }.bind(this));
      },
      gotoMain: function gotoMain() {
        cc.director.loadScene("helloworld");
      },
      loadRes: function loadRes() {}
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  PlayerYahtzee: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "acbae8MQJVMtrUiAPUu8RmS", "PlayerYahtzee");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        boxDice: cc.Node,
        dicePrefab: cc.Prefab,
        btn: cc.Node,
        txtBtn: cc.Label,
        crowns: [ cc.Sprite ]
      },
      init: function init(index) {
        this.index = index;
        this.win = 0;
        this.dicePool = new cc.NodePool();
        for (var i = 0; i < 5; i++) {
          var dice = cc.instantiate(this.dicePrefab);
          this.dicePool.put(dice);
        }
        this.ai = this.getComponent("AIYahtzee");
      },
      startRound: function startRound() {
        this.initDices();
        this.rollCount = 3;
        this.holdList = [];
        this.txtBtn.string = "\u6295\u63b7";
        this.btn.active = 0 == this.index;
      },
      initDices: function initDices() {
        this.diceList = [];
        for (var i = 0; i < 5; i++) {
          var dice = this.dicePool.get();
          dice.getComponent("DiceYahtzee").init(i, this.index);
          this.boxDice.addChild(dice);
          this.diceList.push(dice);
        }
        this.scheduleOnce(function() {
          0 == this.index ? this.btn.active = true : this.roll();
        }.bind(this), .3);
      },
      roll: function roll() {
        if (this.holdList.length < 5) {
          for (var i = 0; i < 5; i++) {
            var dice = this.diceList[i].getComponent("DiceYahtzee");
            dice.holded || dice.roll();
          }
          this.rollCount--;
          if (this.rollCount <= 0) {
            0 == this.index && (this.btn.active = false);
            this.recycle();
          } else 1 == this.index && this.ai.check();
        } else if (0 == this.index) {
          this.btn.active = false;
          window.yahtzeeLayer.endRound();
        } else window.yahtzeeLayer.doRound();
      },
      recycle: function recycle() {
        this.scheduleOnce(function() {
          for (var i = 0; i < 5; i++) {
            var dice = this.diceList[i].getComponent("DiceYahtzee");
            dice.holded || dice.hold();
            dice.abled = false;
          }
        }.bind(this), .5);
        this.scheduleOnce(function() {
          if (0 == this.index) {
            this.btn.active = false;
            window.yahtzeeLayer.endRound();
          } else window.yahtzeeLayer.doRound();
        }.bind(this), 1);
      },
      calculateScore: function calculateScore() {
        var elementList = [ 0, 0, 0, 0, 0, 0 ];
        for (var i = 0; i < 5; i++) {
          var dice = this.diceList[i].getComponent("DiceYahtzee");
          elementList[dice.element - 1]++;
        }
        elementList.sort(function(a, b) {
          return b - a;
        });
        5 == elementList[0] ? this.score = 7 : 4 == elementList[0] ? this.score = 6 : 3 == elementList[0] ? 2 == elementList[1] ? this.score = 5 : this.score = 4 : 2 == elementList[0] ? 2 == elementList[1] ? this.score = 3 : this.score = 1 : this.score = 2;
      },
      doWin: function doWin() {
        cc.loader.loadRes("Texture/battle/mark_crown1", cc.SpriteFrame, function(err, spriteFrame) {
          this.crowns[this.win].spriteFrame = spriteFrame;
          this.win++;
        }.bind(this));
      }
    });
    cc._RF.pop();
  }, {} ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ba4f5YaUElBy61UWqBofsfz", "Player");
    "use strict";
    var game = require("Game");
    var utils = require("Utils");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        cardPrefab: cc.Prefab,
        dicePrefab: cc.Prefab,
        chestPrefab: cc.Prefab,
        dmgAnimation: cc.Prefab
      },
      init: function init(index) {
        this.index = index;
        if (0 == index) {
          this.host = this.getComponent("Hero");
          this.opponent = window.mainLayer.enemy.player;
          this.boxCard = window.mainLayer.boxCardHero;
          this.boxDice = window.mainLayer.boxDiceHero;
        } else {
          this.host = this.getComponent("Enemy");
          this.opponent = window.mainLayer.hero.player;
          this.boxCard = window.mainLayer.boxCardEnemy;
          this.boxDice = window.mainLayer.boxDiceEnemy;
        }
        this.buff = this.getComponent("Buff");
        this.buff.init();
        this.equip = this.getComponent("Equip");
        this.equip.init();
        this.cardPool = new cc.NodePool();
        for (var i = 0; i < 6; i++) {
          var card = cc.instantiate(this.cardPrefab);
          this.cardPool.put(card);
        }
        this.dicePool = new cc.NodePool();
        for (var _i = 0; _i < 5; _i++) {
          var dice = cc.instantiate(this.dicePrefab);
          this.dicePool.put(dice);
        }
        this.round = 0;
        this.extraDice = 0;
        this.showQueue = [];
        this.cardPlayed = 0;
        this.cardPlayedRound = 0;
        this.atkPlayed = 0;
        this.atkRound = 0;
        this.diceUsabld = true;
        this.cardUsabled = true;
        this.deck = this.host.deck;
        this.diceCount = 0 == index ? 5 : this.host.diceCount;
        var list = [ 85, 86, 89, 90, 91, 92 ];
        for (var _i2 = 0; _i2 < list.length; _i2++) this.equip.checkWithTrigger(list[_i2]) && this.diceCount++;
        this.equip.trigger(88) && this.diceCount++;
        this.host.txtDice.string = "\xd7" + this.diceCount;
        var anim = cc.instantiate(this.dmgAnimation);
        this.node.addChild(anim);
        if (0 == this.index) {
          anim.scale = .8;
          anim.position = cc.v2(-302, 33);
        } else anim.position = cc.v2(0, this.host.figureNode.y + this.host.figure.height / 2);
        this.anim = anim.getComponent("DmgAnimation");
        this.anim.init(index);
      },
      start: function start() {
        this.checkGameBegin();
      },
      startRound: function startRound() {
        this.round++;
        this.rollCount = this.equip.checkWithTrigger(58) ? 4 : 3;
        this.checkStart();
        if (0 == this.index) {
          this.diceUsabld = false;
          this.cardUsabled = false;
          if (2 == game.heroId) {
            this.chestList = [ null, null, null ];
            this.createChest();
          }
        }
        this.initCards();
        this.initDices();
        window.mainLayer.gameOver || this.host.startRound();
      },
      initDices: function initDices() {
        this.diceList = [];
        this.holdList = [ 0, 0, 0, 0, 0, 0 ];
        var count = this.diceCount + this.extraDice;
        var list = utils.getDifferentRandomNum(count, count - 1, 0);
        var lockCount = Math.min(this.buff.lock, count);
        var lockList = list.splice(0, lockCount);
        this.buff.removeBuff(28, lockCount);
        var iceCount = 0;
        var iceList = [];
        if (!this.equip.checkWithTrigger(63)) {
          iceCount = Math.min(this.buff.freeze, count - lockCount);
          iceList = list.splice(0, iceCount);
          this.buff.removeBuff(22, iceCount);
        }
        for (var i = 0; i < count; i++) {
          var buffId = null;
          for (var j = 0; j < lockList.length; j++) if (i == lockList[j]) {
            buffId = 28;
            break;
          }
          if (!buffId) for (var _j = 0; _j < iceList.length; _j++) if (i == iceList[_j]) {
            buffId = 22;
            break;
          }
          var dice = null;
          dice = this.dicePool.size() > 0 ? this.dicePool.get() : cc.instantiate(this.dicePrefab);
          var x = 0;
          x = count <= 6 ? -(count - 1) / 2 * 110 + 110 * i : 640 / (count - 1) * i - 320;
          dice.position = cc.v2(x, 0 == window.mainLayer.roundId ? -120 : 600);
          dice.getComponent("Dice").init(i, buffId);
          this.boxDice.addChild(dice);
          this.diceList.push(dice);
        }
        this.scheduleOnce(function() {
          this.roll(true);
        }.bind(this), .5);
      },
      initCards: function initCards() {
        this.cardList = [];
        var count = Math.min(this.deck.length, 6);
        var silenceCount = this.equip.checkWithTrigger(66) ? 0 : this.buff.silence;
        var burnCount = this.equip.checkWithTrigger(62) ? 0 : this.buff.burn;
        for (var i = 0; i < count; i++) {
          var buffId = null;
          var element = config.get("cfg_card", this.deck[i]).element;
          if (this.buff.silenceDark && 6 == element) buffId = 25; else if (Math.random() < silenceCount / (count - i)) {
            buffId = 25;
            silenceCount--;
            this.buff.removeBuff(25, 1);
          } else if (this.buff.burnIce && 2 == element) buffId = 21; else if (Math.random() < burnCount / (count - i)) {
            buffId = 21;
            burnCount--;
            this.buff.removeBuff(21, 1);
          }
          this.drawCard(this.deck[i], buffId);
        }
      },
      drawCard: function drawCard(cfgId, buffId, isTemp) {
        var index = this.getEmptyIndex();
        if (index < 0) return;
        var card = null;
        card = this.cardPool.size() > 0 ? this.cardPool.get() : cc.instantiate(this.cardPrefab);
        card.getComponent("Card").init(cfgId, index, buffId, 0);
        card.getComponent("Card").isTemp = isTemp;
        this.boxCard.addChild(card, 100);
        this.cardList.push(card);
        return card;
      },
      patchCard: function patchCard(cfgId, isNoTemp, unCost) {
        var buff = this.buff;
        var buffId = null;
        cfgId = cfgId || game.getRandomCardId();
        var element = config.get("cfg_card", cfgId).element;
        if (buff.silenceDark && 6 == element) buffId = 25; else if (buff.silence > 0 && !this.equip.checkWithTrigger(66)) {
          buffId = 25;
          buff.removeBuff(25, 1);
        } else if (buff.burnIce && 2 == element) buffId = 21; else if (buff.burn > 0 && !this.equip.checkWithTrigger(62)) {
          buffId = 21;
          buff.removeBuff(21, 1);
        }
        var card = this.drawCard(cfgId, buffId, !isNoTemp);
        unCost && card.getComponent("Card").disCost();
        this.checkCardsRequire();
        0 == this.index && this.host.checkBtnRoll();
        this.equip.trigger(119);
        return card;
      },
      roll: function roll(isFirst, defined) {
        for (var i = 0; i < this.diceList.length; i++) {
          var dice = this.diceList[i].getComponent("Dice");
          if (true == isFirst) dice.roll(); else if (!dice.freeze && !dice.lock && !dice.temp) if (defined) {
            dice.holded && dice.hold();
            dice.roll(defined);
          } else dice.holded || dice.roll();
        }
        if (isFirst) this.scheduleOnce(function() {
          this.refreshCardBuff();
          this.checkElement();
          this.rollCount--;
        }.bind(this), .2); else {
          this.checkElement();
          var differentCount = 0;
          for (var _i3 = 0; _i3 < 6; _i3++) this.elementList[_i3] > 0 && differentCount++;
          if (differentCount >= 5) {
            this.equip.trigger(115);
            this.equip.trigger(116);
          }
          this.rollCount--;
          0 == window.mainLayer.roundId && this.host.checkBtnRoll(true);
        }
      },
      checkElement: function checkElement() {
        this.elementList = [ 0, 0, 0, 0, 0, 0 ];
        for (var i = 0; i < this.diceList.length; i++) {
          var dice = this.diceList[i].getComponent("Dice");
          dice.lock || this.elementList[dice.element - 1]++;
        }
        this.cardAbledCount = this.checkCardsRequire();
        if (this.chestList) for (var _i4 = 0; _i4 < 3; _i4++) this.chestList[_i4] && this.chestList[_i4].getComponent("Chest").checkRequire();
      },
      refreshCardBuff: function refreshCardBuff() {
        for (var i = 0; i < this.cardList.length; i++) this.cardList[i].getComponent("Card").initBuff();
        this.scheduleOnce(function() {
          this.refreshDiceBuff();
        }.bind(this), .2);
      },
      refreshDiceBuff: function refreshDiceBuff() {
        for (var i = 0; i < this.diceList.length; i++) this.diceList[i].getComponent("Dice").initBuff();
        this.checkElement();
        var differentCount = 0;
        for (var _i5 = 0; _i5 < 6; _i5++) this.elementList[_i5] > 0 && differentCount++;
        if (differentCount >= 5) {
          this.equip.trigger(115);
          this.equip.trigger(116);
        }
        this.cardAbledCount <= 0 && this.equip.trigger(45);
        for (var _i6 = 48; _i6 <= 53; _i6++) this.equip.trigger(_i6);
        this.equip.trigger(93);
        if (0 == window.mainLayer.roundId) {
          this.host.checkBtnRoll(true);
          this.diceUsabld = true;
          this.cardUsabled = true;
        }
      },
      createExDice: function createExDice(element) {
        var buffId = null;
        if (this.buff.lock > 0) {
          buffId = 28;
          this.buff.removeBuff(28, 1);
        } else if (this.buff.freeze > 0 && !this.equip.checkWithTrigger(63)) {
          buffId = 22;
          this.buff.removeBuff(22, 1);
        }
        var dice = null;
        dice = this.dicePool.size() > 0 ? this.dicePool.get() : cc.instantiate(this.dicePrefab);
        this.diceList.length <= 5 ? dice.x = this.diceList.length / 2 * 110 : dice.x = 320;
        dice.getComponent("Dice").init(this.diceList.length - 1, buffId);
        this.boxDice.addChild(dice);
        this.diceList.push(dice);
        dice.getComponent("Dice").roll(element);
        element && dice.getComponent("Dice").doTemp();
        for (var i = 0; i < this.diceList.length; i++) {
          var _dice = this.diceList[i];
          _dice.stopAllActions();
          _dice.opacity = 255;
          var x = 0;
          x = this.diceList.length <= 6 ? -(this.diceList.length - 1) / 2 * 110 + 110 * i : 640 / (this.diceList.length - 1) * i - 320;
          _dice.runAction(cc.moveTo(.2, cc.v2(x, 0)));
        }
        this.checkElement();
        this.extraDice++;
        this.host.txtExDice.string = "(+" + this.extraDice + ")";
      },
      endRound: function endRound() {
        this.scheduleOnce(function() {
          for (var i = this.cardList.length - 1; i >= 0; i--) this.cardList[i].getComponent("Card").remove();
        }.bind(this), .3);
        for (var i = 0; i < this.diceList.length; i++) this.diceList[i].getComponent("Dice").remove();
        if (this.chestList) for (var _i7 = 0; _i7 < 3; _i7++) this.chestList[_i7] && this.chestList[_i7].getComponent("Chest").remove();
        this.host.endRound();
        this.scheduleOnce(function() {
          if (this.buff.exRound > 0) {
            this.startRound();
            this.buff.removeBuff(101, 1);
          } else window.mainLayer.doRound();
        }.bind(this), .5);
        this.extraDice = 0;
        this.host.txtExDice.string = "";
        this.settleBuff();
        this.settleEquip();
      },
      checkCardsRequire: function checkCardsRequire() {
        var num = 0;
        for (var i = 0; i < this.cardList.length; i++) {
          var usable = this.cardList[i].getComponent("Card").checkRequire();
          usable && num++;
        }
        return num;
      },
      checkGameBegin: function checkGameBegin() {
        var list = [ 6, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 30, 37, 44, 86, 91, 96, 114 ];
        for (var i = 0; i < list.length; i++) this.equip.trigger(list[i]);
        this.equip.check(77) && (this.equip.magicSheild = 1);
        this.equip.check(101) && (this.equip.goldArmor = 1);
        this.equip.check(43) && (this.equip.luckyCard = 1);
        7 == game.roomType && this.equip.trigger(61);
        0 == this.index && game.debuff > 0 && this.onHurt(3 * game.debuff, 1, 7);
      },
      checkStart: function checkStart() {
        this.showQueue = [];
        this.round > 1 && this.buff.removeBuff(13, this.buff.table[13]);
        var list = [ 5, 9, 25, 84, 105, 111, 121 ];
        for (var i = 0; i < list.length; i++) this.equip.trigger(list[i]);
        if (this.buff.poison > 0 && !this.equip.checkWithTrigger(67)) {
          var dmg = this.buff.poison * (this.opponent.equip.checkWithTrigger(112) ? 2 : 1);
          this.host.onHurt(dmg, 1, 26);
          this.opponent.equip.checkWithTrigger(103) || this.buff.removeBuff(26, 1);
        }
        this.buff.undead > 0 && this.buff.removeBuff(102, 1);
      },
      settleBuff: function settleBuff() {
        this.buff.removeBuff(21, this.buff.table[21]);
        this.buff.removeBuff(22, this.buff.table[22]);
        this.buff.removeBuff(25, this.buff.table[25]);
        this.buff.removeBuff(27, this.buff.table[27]);
        this.buff.removeBuff(28, this.buff.table[28]);
        this.buff.table[23] > 0 && this.buff.removeBuff(23, 1);
        this.buff.table[24] > 0 && this.buff.removeBuff(24, 1);
        this.buff.multiCast = this.buff.multiCastMax = 0;
        this.buff.elementRoundCasted = [ 0, 0, 0, 0, 0, 0 ];
        this.buff.burnIce = false;
        this.buff.silenceDark = false;
      },
      settleEquip: function settleEquip() {
        var list = [ 2, 3, 27, 11, 57, 59, 60, 104, 110 ];
        for (var i = 0; i < list.length; i++) this.equip.trigger(list[i]);
        this.opponent.equip.trigger(118);
        this.cardPlayedRound = 0;
        this.atkRound = 0;
        this.equip.swiftGlove = false;
        this.equip.suckRemainder = 0;
      },
      onHurt: function onHurt(dmg, source, element) {
        if (this.buff.frail > 0 && 0 == source && !this.equip.checkWithTrigger(64)) {
          var rate = .5;
          this.opponent.equip.checkWithTrigger(54) && (rate += .25);
          this.equip.checkWithTrigger(56) && (rate -= .25);
          this.equip.checkWithTrigger(113) && (rate *= 2);
          this.opponent.equip.checkWithTrigger(113) && (rate *= 2);
          dmg = Math.floor(dmg * (rate + 1));
        }
        this.opponent.equip.checkWithTrigger(21) && (dmg += 1);
        this.opponent.host.hp < 10 && this.opponent.equip.checkWithTrigger(75) && (dmg += 3);
        this.index == window.mainLayer.roundId && this.equip.checkWithTrigger(98) && (dmg = 0);
        if (dmg > 0 && this.equip.magicSheild > 0) {
          this.equip.magicSheild--;
          this.equip.doTrigger(77);
          dmg = 1;
        }
        if (dmg > 10 && this.equip.goldArmor > 0) {
          this.equip.goldArmor--;
          this.equip.doTrigger(101);
          dmg = 1;
        }
        dmg > 0 && this.equip.checkWithTrigger(114) && dmg--;
        9 == element && dmg > 0 && this.opponent.host.onHeal(dmg);
        this.opponent.equip.suckRemainder += dmg;
        this.opponent.equip.trigger(23);
        this.buff.atkBack > 0 && 0 == source && dmg > 0 && this.opponent.host.onHurt(this.buff.atkBack, 1, 29);
        dmg > 0 && this.index == window.mainLayer.roundId && this.equip.checkWithTrigger(99) && this.opponent.host.onHurt(dmg, 2, 29);
        this.assertHpChange("-" + dmg, 0);
        this.anim.show(element);
        if (this.host.armor > 0) {
          if (this.host.armor >= dmg) {
            this.host.updateArmor(-dmg);
            return;
          }
          dmg -= this.host.armor;
          this.host.updateArmor(-this.armor);
        }
        this.host.hp -= dmg;
        if (this.host.hp <= 0 && this.buff.undead > 0) {
          this.anim.show(201);
          this.host.hp = 1;
        }
        this.host.hp <= 0 && this.equip.trigger(10);
        this.equip.check(75) && this.host.hp < 10 && this.buff.atkAdd < 3 && this.buff.addBuff(104, 3);
        this.host.txtHp.string = this.host.hp + "/" + this.host.hpMax;
        this.host.stripHp.progress = this.host.hp / this.host.hpMax;
      },
      onHeal: function onHeal(hp) {
        if (this.equip.checkWithTrigger(122)) {
          var reply = Math.min(hp, this.host.hpMax - this.host.hp);
          this.opponent.host.onHurt(reply, 2);
        }
        this.host.hp += hp;
        this.equip.trigger(102);
        this.equip.trigger(123);
        this.anim.show(12);
        this.equip.check(75) && this.host.hp >= 10 && this.buff.atkAdd >= 3 && this.buff.removeBuff(104, 3);
      },
      assertHpChange: function assertHpChange(str, colorId) {
        this.showQueue.push([ str, colorId ]);
        1 == this.showQueue.length && this.showHpChange();
      },
      showHpChange: function showHpChange() {
        var list = this.showQueue[0];
        var num = list[0];
        var colorId = list[1];
        var colors = [ cc.Color.WHITE, cc.color(139, 255, 70), cc.color(255, 40, 40), cc.color(60, 247, 255) ];
        var txt = cc.instantiate(this.host.txtNum);
        txt.getComponent(cc.Label).string = num;
        txt.color = colors[colorId];
        txt.position = this.host.txtNum.position;
        this.node.addChild(txt);
        txt.scale = 0;
        var action1 = cc.spawn(cc.moveBy(.1, cc.v2(30, 10)), cc.scaleTo(.1, 1.1));
        var action1 = cc.spawn(cc.moveBy(.05, cc.v2(0, 0 == this.index ? 0 : -10)), cc.scaleTo(.05, 1));
        txt.runAction(cc.sequence(action1, action1, cc.moveBy(.05, cc.v2(13 + 10 * Math.random(), 3 + 5 * Math.random())), cc.moveBy(.1, cc.v2(3 + 10 * Math.random(), -3 - 10 * Math.random())), cc.fadeOut(.5), cc.callFunc(function() {
          txt.destroy();
        }.bind(this))));
        txt.runAction(cc.sequence(cc.delayTime(.15), cc.callFunc(function() {
          this.showQueue.shift();
          this.showQueue.length > 0 && this.showHpChange();
        }.bind(this))));
      },
      getEmptyIndex: function getEmptyIndex() {
        for (var i = 0; i < 6; i++) {
          var exited = false;
          this.chestList && this.chestList[i % 3] && (exited = true);
          if (!exited) for (var j = 0; j < this.cardList.length; j++) {
            var card = this.cardList[j].getComponent("Card");
            if (card.index == i) {
              exited = true;
              break;
            }
          }
          if (!exited) return i;
        }
        return -1;
      },
      createChest: function createChest(isCheckRequire) {
        var index = -1;
        for (var i = 2; i >= 0; i--) if (!this.chestList[i]) {
          index = i;
          break;
        }
        if (index >= 0) {
          var chest = cc.instantiate(this.chestPrefab);
          chest.getComponent("Chest").init(index);
          this.boxCard.addChild(chest, 100);
          this.chestList[index] = chest;
          isCheckRequire && chest.getComponent("Chest").checkRequire();
        }
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game",
    Utils: "Utils"
  } ],
  PotionCommodity: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "85c55EVbbNKe72lZU+lcHho", "PotionCommodity");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        sprite: cc.Sprite,
        txtName: cc.Label
      },
      init: function init(cfgId) {
        cc.loader.loadRes("Texture/UI/image_potion" + cfgId, cc.SpriteFrame, function(err, spriteFrame) {
          this.sprite.spriteFrame = spriteFrame;
        }.bind(this));
        this.txtName.string = "\u751f\u547d +" + 10 * cfgId;
      }
    });
    cc._RF.pop();
  }, {} ],
  RequireRound: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3a0eeaFa/FFsJmcvXZBEaHe", "RequireRound");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        circle: cc.Sprite,
        sprite: cc.Sprite
      },
      init: function init(element, cardElement) {
        var boxColors = [ cc.color(165, 56, 77), cc.color(90, 109, 149), cc.color(64, 107, 80), cc.color(157, 103, 67), cc.color(171, 137, 65), cc.color(95, 77, 139), cc.color(160, 160, 160) ];
        this.node.color = boxColors[cardElement - 1];
        this.unCost = false;
        this.satisfied = false;
        if (element > 0) {
          this.element = element;
          this.refreshElement();
        }
      },
      refreshElement: function refreshElement(element) {
        element && (this.element = element);
        cc.loader.loadRes("Texture/battle/element" + this.element, cc.SpriteFrame, function(err, spriteFrame) {
          this.sprite.node.active = true;
          this.sprite.spriteFrame = spriteFrame;
        }.bind(this));
      },
      refreshSatisfy: function refreshSatisfy(isSatisfied) {
        this.satisfied = isSatisfied;
        if (this.satisfied && !this.unCost) {
          var colorList = [ cc.color(255, 56, 50), cc.color(44, 180, 255), cc.color(0, 247, 118), cc.color(255, 150, 82), cc.color(255, 251, 75), cc.color(191, 127, 228) ];
          this.sprite.node.color = colorList[this.element - 1];
        } else this.sprite.node.color = cc.color(255, 255, 255);
      },
      hideElement: function hideElement() {
        this.element = null;
        this.sprite.node.active = false;
      },
      disCost: function disCost() {
        this.unCost = true;
        cc.loader.loadRes("Texture/battle/image_requireLine2", cc.SpriteFrame, function(err, spriteFrame) {
          this.circle.spriteFrame = spriteFrame;
        }.bind(this));
        cc.loader.loadRes("Texture/battle/unelement" + this.element, cc.SpriteFrame, function(err, spriteFrame) {
          this.sprite.node.active && (this.sprite.spriteFrame = spriteFrame);
        }.bind(this));
        this.refreshSatisfy(true);
      }
    });
    cc._RF.pop();
  }, {} ],
  Room: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "20286qrg/RMq6rq0m6qk3EY", "Room");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        door: [ cc.Button ],
        mark: [ cc.Sprite ],
        btnAlter: cc.Sprite,
        monsterNode: cc.Node,
        monsterFigure: cc.Sprite
      },
      init: function init(isNewRoom) {
        window.room = this;
        this.pos = game.heroPos;
        this.abled = false;
        this.isNewRoom = isNewRoom;
        if (isNewRoom) this.initFloorConfig(); else {
          this.initHero();
          this.typeList = game.historyPath[game.floor - 1];
          game.floorBeats[game.floor - 1] && this.initMonsterCfg();
        }
        this.initDoors();
        this.initRoom();
      },
      initHero: function initHero() {
        this.hero = window.homeLayer.hero;
        window.homeLayer.txtFloor.string = game.castle + "-" + game.floor;
        if (this.isNewRoom) {
          var posList = [ cc.v2(0, 250), cc.v2(250, 0), cc.v2(0, -250), cc.v2(-250, 0) ];
          this.hero.position = posList[this.pos];
          this.hero.runAction(cc.sequence(cc.moveTo(.2, cc.v2()), cc.callFunc(function() {
            this.door[this.pos].node.color = cc.Color.GRAY;
            1 != game.roomType && game.roomType < 6 && (this.abled = true);
          }.bind(this)), cc.delayTime(.3), cc.callFunc(function() {
            if (1 == game.roomType || game.roomType >= 6) {
              window.homeLayer = null;
              cc.director.loadScene("mainLayer");
            }
          }.bind(this))));
          this.checkEquip();
        } else {
          this.abled = true;
          this.door[this.pos].node.color = cc.Color.GRAY;
        }
      },
      initDoors: function initDoors() {
        var _this = this;
        var imageList = [ "mark_monster", "mark_camp", "mark_treasure", "mark_event", "mark_shop", "mark_elite", "mark_boss" ];
        for (var i = 0; i < 4; i++) {
          var type = this.typeList[i];
          -1 == type ? this.door[i].node.active = false : type > 0 && function() {
            var sprite = _this.mark[i];
            cc.loader.loadRes("Texture/battle/" + imageList[type - 1], cc.SpriteFrame, function(err, spriteFrame) {
              sprite.spriteFrame = spriteFrame;
            }.bind(_this));
          }();
        }
      },
      initRoom: function initRoom() {
        if (this.isNewRoom) if (1 == game.roomType || game.roomType >= 6) {
          cc.loader.loadRes("Texture/monster/" + game.monsterId, cc.SpriteFrame, function(err, spriteFrame) {
            this.monsterFigure.spriteFrame = spriteFrame;
          }.bind(this));
          this.monsterNode.runAction(cc.sequence(cc.scaleTo(.2, .96, 1.03), cc.scaleTo(.4, 1.03, .96), cc.scaleTo(.2, 1, 1)).repeatForever());
          this.btnAlter.node.active = false;
        } else if (game.roomType > 0) {
          var imageList = [ "mark_monster", "mark_camp", "mark_treasure", "mark_event", "mark_shop", "mark_elite", "mark_boss" ];
          cc.loader.loadRes("Texture/battle/" + imageList[game.roomType - 1], cc.SpriteFrame, function(err, spriteFrame) {
            this.btnAlter.spriteFrame = spriteFrame;
          }.bind(this));
        } else this.btnAlter.node.active = false; else if (1 == game.roomType || game.roomType >= 6) this.btnAlter.node.active = false; else if (5 == game.roomType) cc.loader.loadRes("Texture/battle/mark_shop", cc.SpriteFrame, function(err, spriteFrame) {
          this.btnAlter.spriteFrame = spriteFrame;
        }.bind(this)); else if (game.floorBeats[game.floor - 1]) this.btnAlter.node.active = false; else if (game.roomType > 0) {
          var _imageList = [ "mark_monster", "mark_camp", "mark_treasure", "mark_event", "mark_shop", "mark_elite", "mark_boss" ];
          cc.loader.loadRes("Texture/battle/" + _imageList[game.roomType - 1], cc.SpriteFrame, function(err, spriteFrame) {
            this.btnAlter.spriteFrame = spriteFrame;
          }.bind(this));
        } else this.btnAlter.node.active = false;
      },
      gotoDoor: function gotoDoor(e, id) {
        if (id != this.pos && this.abled) {
          this.abled = false;
          var posList = [ cc.v2(0, 250), cc.v2(250, 0), cc.v2(0, -250), cc.v2(-250, 0) ];
          game.heroPos = (parseInt(id) + 2) % 4;
          game.floor++;
          if (game.castle < 3 && game.floor > 12) {
            game.floor = 1;
            game.castle++;
            game.historyPath = [];
            game.historyChoose = [ 0 ];
            game.floorBeats = [];
          } else if (3 == game.castle && game.floor > 13) {
            window.homeLayer.openComplete();
            return;
          }
          game.roomType = this.typeList[id];
          game.historyChoose[game.floor - 1] = game.roomType;
          (1 == game.roomType || game.roomType >= 6) && (game.monsterId = game.monsterCfg[id]);
          this.hero.runAction(cc.sequence(cc.moveTo(.2, posList[id]), cc.callFunc(function() {
            window.homeLayer.changeRoom(id);
          }.bind(this))));
        }
      },
      openAlter: function openAlter() {
        window.homeLayer.openAlter();
      },
      checkEquip: function checkEquip() {
        2 == game.roomType && game.equip.indexOf(38) >= 0 && (game.hp = Math.min(game.hp + 10, game.hpMax));
        3 == game.roomType && game.equip.indexOf(42) >= 0 && (game.copper += 30);
      },
      initFloorConfig: function initFloorConfig() {
        var quest = game.floorQuests[game.castle - 1][game.floor - 1].concat();
        if (1 == quest.length) {
          this.typeList = [ -1, -1, -1, -1 ];
          this.typeList[this.pos] = -2;
          this.typeList[(this.pos + 2) % 4] = quest[0];
        } else {
          while (quest.length < 3) quest.splice(Math.floor(Math.random() * (quest.length + 1)), 0, -1);
          quest.splice(this.pos, 0, -2);
          this.typeList = quest;
        }
        game.historyPath[game.floor - 1] = this.typeList;
        if (4 == game.roomType) game.eventIds.length > 0 ? game.eventId = game.eventIds.shift() : game.eventId = Math.floor(17 * Math.random()) + 1; else if (5 == game.roomType) {
          var cardList = [];
          var itemList = [];
          var qualityList = [ [ 0, .7, .3 ], [ 0, .5, .5 ], [ 0, .3, .7 ] ];
          while (cardList.length < 3) {
            var quality = 0;
            var random = Math.random();
            var rateSum = 0;
            for (var i = 0; i < 3; i++) {
              rateSum += qualityList[game.castle - 1][i];
              if (random < rateSum) {
                quality = i + 1;
                break;
              }
            }
            var cardId = game.getNewCardId(quality);
            var exited = false;
            for (var _i = 0; _i < cardList.length; _i++) if (cardId == cardList[_i]) {
              exited = true;
              break;
            }
            exited || cardList.push(cardId);
          }
          var qualityList = [ [ .4, .4, .2 ], [ .3, .4, .3 ], [ .2, .4, .4 ] ];
          while (itemList.length < 3) {
            var _quality = 0;
            var _random = Math.random();
            var _rateSum = 0;
            for (var _i2 = 0; _i2 < 3; _i2++) {
              _rateSum += qualityList[game.castle - 1][_i2];
              if (_random < _rateSum) {
                _quality = _i2 + 1;
                break;
              }
            }
            var itemId = game.getNewItemId(1, _quality);
            var _exited = false;
            for (var _i3 = 0; _i3 < itemList.length; _i3++) if (itemId == itemList[_i3]) {
              _exited = true;
              break;
            }
            _exited || itemList.push(itemId);
          }
          var potionList = [ 1, 2 ];
          game.shopIds = cardList.concat(itemList, potionList);
          game.itemEffect.vip1 && (game.discountItem = Math.floor(3 * Math.random()));
          game.itemEffect.vip2 && (game.discountCard = Math.floor(3 * Math.random()));
        }
        1 != game.roomType && game.roomType < 6 && this.initMonsterCfg();
      },
      initMonsterCfg: function initMonsterCfg() {
        game.monsterCfg = [ 0, 0, 0, 0 ];
        var lv = 2 * (game.castle - 1) + (game.floor <= 5 ? 1 : 2);
        for (var i = 0; i < 4; i++) {
          var type = this.typeList[i];
          if (1 == type || type >= 6) {
            var monsterId = 0;
            while (monsterId <= 0) {
              var monsterType = 1 == type ? 0 : 6 == type ? 1 : 2;
              if (12 == game.floor) {
                lv = 7;
                monsterType = 3;
              }
              var id = game.getNewMonsterId(lv, monsterType);
              game.monsterCfg.indexOf(id) < 0 && (monsterId = id);
            }
            game.monsterCfg[i] = monsterId;
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  ShopItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "47158KpbiJMF46lKbQmGdRL", "ShopItem");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        cardPrefab: cc.Prefab,
        itemPrefab: cc.Prefab,
        potionPrefab: cc.Prefab,
        txtCost: cc.Label,
        txtDiscount: cc.Node,
        iconNode: cc.Node
      },
      init: function init(cfgId, type, discount) {
        this.cfgId = cfgId;
        this.type = type;
        var item = void 0;
        if (0 == type) {
          item = cc.instantiate(this.cardPrefab);
          item.getComponent("CardCollection").init(cfgId);
          this.cost = 3 * config.get("cfg_card", cfgId).value;
        } else if (1 == type) {
          item = cc.instantiate(this.itemPrefab);
          item.getComponent("ItemCommodity").init(cfgId);
          this.cost = 6 * config.get("cfg_item", cfgId).value;
        } else {
          item = cc.instantiate(this.potionPrefab);
          item.getComponent("PotionCommodity").init(cfgId);
          this.cost = 1 == cfgId ? 20 : 50;
        }
        item.position = cc.v2(0, 1 == type ? 20 : 10);
        this.iconNode.addChild(item);
        this.item = item;
        if (discount) {
          this.txtDiscount.active = true;
          this.cost = Math.ceil(.3 * this.cost);
          this.txtCost.node.color = cc.Color.BLACK.fromHEX("#54EAD0");
          this.txtCost.getComponent(cc.LabelOutline).color = cc.Color.BLACK.fromHEX("#54EAD0");
        }
        this.txtCost.string = this.cost;
      },
      buy: function buy() {
        if (game.copper >= this.cost) {
          game.copper -= this.cost;
          0 == this.type ? game.getCard(this.cfgId) : 1 == this.type ? game.getItem(this.cfgId) : game.hp = Math.min(game.hp + 10 * this.cfgId, game.hpMax);
          var index = game.shopIds.indexOf(this.cfgId);
          game.shopIds[index] = 0;
          this.node.destroy();
          window.homeLayer.refreshHeroData();
        } else this.item.runAction(cc.sequence(cc.rotateTo(.05, 10), cc.rotateTo(.1, -10), cc.rotateTo(.1, 10), cc.rotateTo(.1, -10), cc.rotateTo(.05, 0)));
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  ShopLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f8baepveSxIlbuJL5yNDtxX", "ShopLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        boxs: [ cc.Node ],
        shopItemPrefab: cc.Prefab,
        curtain: cc.Node,
        title: cc.Node
      },
      onLoad: function onLoad() {
        window.shopLayer = this;
        this.initCards();
        this.initEquip();
        this.initPotions();
        this.curtain.runAction(cc.moveTo(.15, cc.v2(0, -17)));
        this.title.runAction(cc.sequence(cc.delayTime(.15), cc.moveTo(.25, cc.v2(9, -35))));
        this.title.runAction(cc.sequence(cc.delayTime(.15), cc.skewTo(.2, 2, 0), cc.skewTo(.2, -2, 0), cc.skewTo(.2, 1, 0), cc.skewTo(.2, -1, 0), cc.skewTo(.2, 1, 0), cc.skewTo(.2, -1, 0), cc.skewTo(.2, 0, 0)));
      },
      initCards: function initCards() {
        for (var i = 0; i < 3; i++) {
          var cardId = game.shopIds[i];
          if (cardId > 0) {
            var item = cc.instantiate(this.shopItemPrefab);
            item.getComponent("ShopItem").init(cardId, 0, i == game.discountCard);
            item.position = cc.v2(i % 3 * 245 - 245, 0);
            this.boxs[0].addChild(item);
          }
        }
        this.boxs[0].x = -750;
        this.boxs[0].y += (cc.winSize.height / cc.winSize.width * 750 - 1334) / 4;
        this.boxs[0].runAction(cc.sequence(cc.delayTime(.1), cc.moveBy(.2, cc.v2(750, 0))));
      },
      initEquip: function initEquip() {
        for (var i = 0; i < 3; i++) {
          var itemId = game.shopIds[i + 3];
          if (itemId > 0) {
            var item = cc.instantiate(this.shopItemPrefab);
            item.getComponent("ShopItem").init(itemId, 1, i == game.discountItem);
            item.position = cc.v2(i % 3 * 245 - 245, 0);
            this.boxs[1].addChild(item);
          }
        }
        this.boxs[1].x = 750;
        this.boxs[1].runAction(cc.sequence(cc.delayTime(.2), cc.moveBy(.2, cc.v2(-750, 0))));
      },
      initPotions: function initPotions() {
        for (var i = 0; i < 2; i++) {
          var potionId = game.shopIds[i + 6];
          if (potionId > 0) {
            var potion = cc.instantiate(this.shopItemPrefab);
            potion.getComponent("ShopItem").init(potionId, 2);
            potion.position = cc.v2(i % 3 * 245 - 245, 0);
            this.boxs[2].addChild(potion);
          }
        }
        this.boxs[2].x = -750;
        this.boxs[2].y -= (cc.winSize.height / cc.winSize.width * 750 - 1334) / 4;
        this.boxs[2].runAction(cc.sequence(cc.delayTime(.3), cc.moveBy(.2, cc.v2(750, 0))));
      },
      close: function close() {
        this.boxs[2].runAction(cc.moveBy(.2, cc.v2(-750, 0)));
        this.boxs[1].runAction(cc.sequence(cc.delayTime(.1), cc.moveBy(.2, cc.v2(750, 0))));
        this.boxs[0].runAction(cc.sequence(cc.delayTime(.2), cc.moveBy(.2, cc.v2(-750, 0))));
        this.title.runAction(cc.moveTo(.2, cc.v2(9, 230)));
        this.curtain.runAction(cc.sequence(cc.delayTime(.2), cc.moveTo(.1, cc.v2(0, 43))));
        this.scheduleOnce(function() {
          this.node.destroy();
        }.bind(this), .4);
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  SkillManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f9b8a6FzCFFt4zg92Jc9Ljj", "SkillManager");
    "use strict";
    var game = require("Game");
    var skill = {
      doCast: function doCast(id) {
        var hero = window.mainLayer.hero;
        var enemy = window.mainLayer.enemy;
        if (1 == game.heroId) 0 == id ? enemy.onHurt(5, 4) : 1 == id && (hero.buff.doubleDmg *= 2); else if (2 == game.heroId) if (0 == id) hero.player.createExDice(); else if (1 == id) {
          for (var i = hero.player.cardList.length - 1; i >= 0; i--) hero.player.cardList[i].getComponent("Card").discard();
          hero.player.cardList = [];
          hero.player.createChest(true);
        }
      }
    };
    module.exports = skill;
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  Skill: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "84424zovvVHiZ6bvX7VE49L", "Skill");
    "use strict";
    var game = require("Game");
    var skillManager = require("SkillManager");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtCost: cc.Label,
        icon: cc.Sprite,
        btn: cc.Button,
        txtName: cc.Label,
        mask: cc.Node
      },
      init: function init(index) {
        this.index = index;
        this.lock = true;
        this.abled = true;
        this.cost = 10 * (index + 1);
        1 == index && game.level < 3 && (this.lock = false);
        if (this.lock) {
          var wordList = [ [ "\u8865\u5200", "\u53cc\u6253" ], [ "\u521b\u9020", "\u5927\u6ee1\u8d2f" ] ];
          var words = wordList[game.heroId - 1];
          this.txtName.string = words[index];
          this.txtCost.string = this.cost;
          cc.loader.loadRes("Texture/hero/skill/" + (2 * game.heroId - 1 + index), cc.SpriteFrame, function(err, spriteFrame) {
            this.icon.spriteFrame = spriteFrame;
          }.bind(this));
        } else {
          this.txtName.string = "3\u7ea7\u89e3\u9501";
          cc.loader.loadRes("Texture/battle/mark_skill", cc.SpriteFrame, function(err, spriteFrame) {
            this.icon.spriteFrame = spriteFrame;
          }.bind(this));
        }
        this.check();
      },
      check: function check() {
        this.lock && this.abled && window.mainLayer.hero.power >= this.cost ? this.btn.interactable = true : this.btn.interactable = false;
        if (this.btn.interactable) {
          this.mask.active = false;
          this.icon.getComponent(cc.Button).enableAutoGrayEffect = false;
        } else {
          this.mask.active = true;
          this.icon.getComponent(cc.Button).enableAutoGrayEffect = this.lock;
        }
      },
      doSkill: function doSkill() {
        if (0 == window.mainLayer.roundId) {
          this.abled = false;
          window.mainLayer.hero.addPower(-this.cost);
          skillManager.doCast(this.index);
        }
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game",
    SkillManager: "SkillManager"
  } ],
  TreasureLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c1d70SEhyZLb7VHewO3MZ0k", "TreasureLayer");
    "use strict";
    var game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        treasurePrefab: cc.Prefab,
        btnGets: [ cc.Node ],
        btnClose: cc.Node,
        boxNode: cc.Node,
        btnNode: cc.Node,
        mask: cc.Node
      },
      init: function init() {
        var quality = 0;
        var qualityList = [ [ .6, .3, .1 ], [ .3, .4, .3 ], [ .1, .4, .5 ] ];
        var random = Math.random();
        var rateSum = 0;
        for (var i = 0; i < 3; i++) {
          rateSum += qualityList[game.castle - 1][i];
          if (random < rateSum) {
            quality = i + 1;
            break;
          }
        }
        if (5 == game.roomType) quality++; else if (game.itemEffect.vase > 0) {
          game.itemEffect.vase--;
          quality++;
        }
        quality = Math.min(quality, 3);
        this.cfgIdList = [];
        var count = 1;
        if (game.itemEffect.flagon > 0) {
          game.itemEffect.flagon--;
          count = 2;
        }
        var cfgId = game.getNewItemId(0, quality);
        this.cfgIdList.push(cfgId);
        if (2 == count) {
          var cfgId2 = 0;
          while (cfgId2 <= 0) {
            var id = game.getNewItemId(0, quality);
            id != cfgId && (cfgId2 = id);
          }
          this.cfgIdList.push(cfgId2);
        }
        this.initItem();
        this.btnNode.opacity = 0;
        this.btnNode.y -= 150;
        var action = cc.spawn(cc.fadeIn(.2), cc.sequence(cc.moveBy(.2, cc.v2(0, 160)), cc.moveBy(.1, cc.v2(0, -10))));
        this.btnNode.runAction(cc.sequence(cc.delayTime(.8), action));
      },
      initItem: function initItem() {
        this.itemList = [];
        this.gotList = [];
        if (1 == this.cfgIdList.length) {
          var item = cc.instantiate(this.treasurePrefab);
          item.getComponent("Treasure").init(this.cfgIdList[0]);
          this.boxNode.addChild(item);
          this.itemList.push(item);
        } else {
          var item = cc.instantiate(this.treasurePrefab);
          item.getComponent("Treasure").init(this.cfgIdList[0]);
          item.position = cc.v2(180, 0);
          this.boxNode.addChild(item);
          this.itemList.push(item);
          var item = cc.instantiate(this.treasurePrefab);
          item.getComponent("Treasure").init(this.cfgIdList[1]);
          item.position = cc.v2(-180, 0);
          this.boxNode.addChild(item);
          this.itemList.push(item);
          this.btnGets[1].active = true;
          this.btnGets[0].position = cc.v2(180, 30);
          this.btnClose.position = cc.v2(0, -100);
        }
      },
      onGet: function onGet(e, index) {
        game.getItem(this.cfgIdList[index]);
        this.gotList.push(this.itemList[index]);
        this.btnGets[index].active = false;
        this.gotList.length >= this.cfgIdList.length && this.close();
      },
      onGiveUp: function onGiveUp() {
        this.close();
      },
      close: function close() {
        window.room.btnAlter.node.active = false;
        game.floorBeats[game.floor - 1] = 3 == game.roomType;
        for (var i = 0; i < this.itemList.length; i++) this.itemList[i].opacity = 0;
        if (this.gotList.length > 0) {
          this.mask.runAction(cc.fadeOut(.2));
          this.btnNode.active = false;
          for (var _i = 0; _i < this.gotList.length; _i++) this.gotList[_i].getComponent("Treasure").got();
          this.scheduleOnce(function() {
            this.node.destroy();
          }.bind(this), .4);
        } else this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  Treasure: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab4bd76AwVKk6GKzcwjcSfb", "Treasure");
    "use strict";
    var game = require("Game");
    var config = require("Config");
    cc.Class({
      extends: cc.Component,
      properties: {
        txtName: cc.Label,
        icon: cc.Sprite,
        txtDesc: cc.RichText,
        boxIcon: cc.Sprite,
        infoNode: cc.Node,
        mask: cc.Node,
        anmation: cc.Node
      },
      init: function init(cfgId) {
        var cfg = config.get("cfg_item", cfgId);
        this.txtName.string = cfg.name;
        var colorList = [ "#31BEFF", "#B689FF", "#FF7F18" ];
        this.txtName.node.color = cc.Color.BLACK.fromHEX(colorList[cfg.quality - 1]);
        this.txtDesc.string = game.analysisDesc(cfg.desc1);
        cc.loader.loadRes("Texture/equip/" + cfgId, cc.SpriteFrame, function(err, spriteFrame) {
          this.icon.spriteFrame = spriteFrame;
        }.bind(this));
        cc.loader.loadRes("Texture/UI/box_icon" + cfg.quality, cc.SpriteFrame, function(err, spriteFrame) {
          this.boxIcon.spriteFrame = spriteFrame;
        }.bind(this));
        this.doAction();
      },
      doAction: function doAction() {
        this.mask.opacity = this.infoNode.opacity = this.boxIcon.node.opacity = 0;
        var action = cc.spawn(cc.moveTo(.4, cc.v2(0, 173)), cc.sequence(cc.scaleTo(.2, .8, 1.1), cc.scaleTo(.2, 1)));
        this.mask.runAction(cc.sequence(cc.delayTime(.5), cc.fadeIn(0), action, cc.fadeOut(.3)));
        this.boxIcon.node.runAction(cc.sequence(cc.delayTime(.9), cc.fadeIn(0)));
        this.infoNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(.3)));
      },
      got: function got() {
        this.node.opacity = 255;
        this.anmation.active = false;
        this.infoNode.active = false;
        var height = cc.winSize.height / cc.winSize.width * 750;
        this.boxIcon.node.runAction(cc.sequence(cc.moveBy(.1, cc.v2(0, 15)), cc.moveTo(.3, cc.v2(211 - this.node.x, -height / 2 - 80 + 115 + 33 - 70))));
      }
    });
    cc._RF.pop();
  }, {
    Config: "Config",
    Game: "Game"
  } ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "85bfaYPayFNlrAFvtzNUMAc", "Utils");
    "use strict";
    var utils = {
      numberFormat: function numberFormat(num) {
        return num / 1e13 >= 1 ? Math.floor(num / 1e12) + "T" : num / 1e10 >= 1 ? Math.floor(num / 1e9) + "B" : num / 1e7 >= 1 ? Math.floor(num / 1e6) + "M" : num / 1e4 >= 1 ? Math.floor(num / 1e3) + "K" : num;
      },
      timeFormat: function timeFormat(tm, type) {
        var second = Math.round(tm / 1e3);
        var s = second % 60;
        var m = type > 1 ? Math.floor(second / 60) % 60 : Math.floor(second / 60);
        var h = 3 == type ? Math.floor(second / 3600) % 24 : Math.floor(second / 3600);
        var d = Math.floor(second / 86400);
        var fixZero = function fixZero(i) {
          return i < 10 ? "0" + i : i;
        };
        var str = "";
        str = 1 == type ? fixZero(m) + ":" + fixZero(s) : 2 == type ? fixZero(h) + ":" + fixZero(m) + ":" + fixZero(s) : d + "\u5929" + h + "\u65f6" + m + "\u5206";
        return str;
      },
      getDifferentRandomNum: function getDifferentRandomNum(num, max, min) {
        max = max || 1;
        min = min || 0;
        var list = [];
        while (list.length < num) {
          var random = Math.floor(Math.random() * (max - min + 1)) + min;
          var exist = false;
          for (var i = 0; i < list.length; i++) if (list[i] - random == 0) {
            exist = true;
            break;
          }
          exist || list.push(random);
        }
        return list;
      },
      createImage: function createImage(avatarUrl, sprite) {
        if (void 0 != window.wx) try {
          var image = wx.createImage();
          image.onload = function() {
            try {
              var texture = new cc.Texture2D();
              texture.initWithElement(image);
              texture.handleLoadedTexture();
              sprite.spriteFrame = new cc.SpriteFrame(texture);
            } catch (e) {
              cc.log(e);
              sprite.node.active = false;
            }
          };
          image.src = avatarUrl;
        } catch (e) {
          cc.log(e);
          sprite.node.active = false;
        } else try {
          cc.loader.load({
            url: avatarUrl,
            type: "jpg"
          }, function(err, texture) {
            sprite.spriteFrame = new cc.SpriteFrame(texture);
          });
        } catch (e) {
          cc.log(e);
          sprite.node.active = false;
        }
      },
      substring: function substring(str, n) {
        if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) return str;
        var len = 0;
        var tmpStr = "";
        for (var i = 0; i < str.length; i++) {
          /[\u4e00-\u9fa5]/.test(str[i]) ? len += 2 : len += 1;
          if (len > n) break;
          tmpStr += str[i];
        }
        return tmpStr;
      },
      getMd5Url: function getMd5Url(url) {
        return cc.loader.md5Pipe ? cc.loader.md5Pipe.transformURL(cc.url.raw(url)) : cc.url.raw(url);
      },
      numToStr: function numToStr(num, digit) {
        digit = digit || 1;
        var str = "" + num;
        for (var i = 1; i <= digit; i++) num < Math.pow(10, i) && (str = "0" + str);
        return str;
      }
    };
    module.exports = utils;
    cc._RF.pop();
  }, {} ],
  Yahtzee: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1712d0/b9dFZ4ZZ+rHnJsH3", "Yahtzee");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        heroNode: cc.Node,
        enemyNode: cc.Node,
        endPrefab: cc.Prefab,
        txtRound: cc.Label,
        boxDesc: cc.Node
      },
      onLoad: function onLoad() {
        window.yahtzeeLayer = this;
        this.descOpen = true;
      },
      start: function start() {
        this.hero = this.heroNode.getComponent("PlayerYahtzee");
        this.enemy = this.enemyNode.getComponent("PlayerYahtzee");
        this.hero.init(0);
        this.enemy.init(1);
        this.roundId = 1;
        this.hostId = 0;
        this.doRound();
        this.boxDesc.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(this.openDesc, this)));
      },
      doRound: function doRound() {
        this.hostId = 1 - this.hostId;
        window.player = 0 == this.hostId ? this.hero : this.enemy;
        window.player.startRound();
      },
      endRound: function endRound() {
        var _this = this;
        var _loop = function _loop(i) {
          var dice = _this.hero.diceList[i];
          dice.runAction(cc.sequence(cc.moveBy(.3, cc.v2(0, 300)), cc.delayTime(1.5), cc.callFunc(function() {
            this.hero.dicePool.put(dice);
          }.bind(_this))));
        };
        for (var i = 0; i < 5; i++) _loop(i);
        var _loop2 = function _loop2(i) {
          var dice = _this.enemy.diceList[i];
          dice.runAction(cc.sequence(cc.moveBy(.3, cc.v2(0, -300)), cc.delayTime(1.5), cc.callFunc(function() {
            this.enemy.dicePool.put(dice);
          }.bind(_this))));
        };
        for (var i = 0; i < 5; i++) _loop2(i);
        this.scheduleOnce(function() {
          this.hero.calculateScore();
          this.enemy.calculateScore();
          if (this.hero.score > this.enemy.score) this.hero.doWin(); else if (this.hero.score < this.enemy.score) this.enemy.doWin(); else {
            this.hero.doWin();
            this.enemy.doWin();
          }
        }.bind(this), 1.5);
        this.scheduleOnce(function() {
          this.checkEnd();
        }.bind(this), 2);
      },
      checkEnd: function checkEnd() {
        if (this.hero.win >= 2 && this.enemy.win >= 2) this.showEnd(0); else if (this.hero.win >= 2 && this.enemy.win < 2) this.showEnd(1); else if (this.hero.win < 2 && this.enemy.win >= 2) this.showEnd(-1); else {
          this.roundId++;
          this.txtRound.string = "\u7b2c" + this.roundId + "\u5c40";
          this.doRound();
        }
      },
      showEnd: function showEnd(result) {
        var layer = cc.instantiate(this.endPrefab);
        layer.getComponent("EndYahtzeeLayer").init(result);
        this.node.addChild(layer);
      },
      openDesc: function openDesc() {
        this.boxDesc.stopAllActions();
        if (this.descOpen) {
          this.descOpen = false;
          this.boxDesc.runAction(cc.moveTo(.15, cc.v2(-428, 93)));
        } else {
          this.descOpen = true;
          this.boxDesc.runAction(cc.moveTo(.15, cc.v2(-279, 93)));
        }
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "AI", "AIYahtzee", "Buff", "CampLayer", "Card", "CardBagLayer", "CardCollection", "CardManager", "Chest", "CompleteLayer", "Config", "CoverLayer", "Dice", "DiceYahtzee", "DmgAnimation", "Edit", "EditEndLayer", "EndLayer", "EndYahtzeeLayer", "Enemy", "Equip", "EquipLayer", "EventLayer", "Fort", "Game", "HelloWorld", "Hero", "Item", "ItemCollection", "ItemCommodity", "LevelUpLayer", "LoseLayer", "MainLayer", "MapLayer", "Opening", "Player", "PlayerYahtzee", "PotionCommodity", "RequireRound", "Room", "ShopItem", "ShopLayer", "Skill", "SkillManager", "Treasure", "TreasureLayer", "Utils", "Yahtzee" ]);