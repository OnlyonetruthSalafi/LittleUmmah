Object.assign(CAST, {
  nuri: { scale: .30, shadow: 250, blink: 1.7, blinkEvery: 6.7, viewScale: {}, wheels: {} },
  hadi: { skip: ['front'], scale: .40, shadow: 170, blink: 3.1, blinkEvery: 5.9, group: true, viewScale: {}, wheels: { side: { 'wheel-r': 62 }, } },
  sabir: { skip: ['front'], scale: .40, shadow: 330, blink: 4.6, blinkEvery: 7.3, group: true, viewScale: {}, wheels: {} },
  safi: { skip: ['front'], scale: .40, shadow: 250, blink: 2.4, blinkEvery: 6.1, group: true, viewScale: {}, wheels: {}, hover: { alt: 150, amp: 7, phase: 1.3 } },
});

for(const [id,c] of Object.entries(CAST)){
 c.shadowMode=(["hadi","sabir"].includes(id))?"contact":"ellipse";
 c.arms={};
}
const ARM_PROFILES={
  "hadi": {
    "back": {
      "l": {
        "grip": [
          314.0,
          572.5
        ],
        "follow": {
          "x": -47.974137931034484,
          "y": 181.14922443372004
        }
      },
      "r": {
        "grip": [
          696.0,
          572.5
        ],
        "follow": {
          "x": 47.974137931034484,
          "y": 180.605766973568
        }
      }
    },
    "front": {
      "l": {
        "grip": [
          448.5,
          541.5
        ],
        "follow": {
          "x": -18.6,
          "y": 167.97558663518146
        }
      },
      "r": {
        "grip": [
          707.5,
          285.0
        ],
        "follow": {
          "x": 34.2,
          "y": 180.26795199152235
        }
      }
    },
    "q": {
      "l": {
        "grip": [
          366.0,
          599.0
        ],
        "follow": {
          "x": -24.8,
          "y": 176.20380903979446
        }
      },
      "r": {
        "grip": [
          690,
          592
        ],
        "follow": {
          "x": 60,
          "y": 240
        }
      }
    },
    "side": {
      "r": {
        "grip": [
          492.0,
          589.0
        ],
        "follow": {
          "x": -3.4565217391304346,
          "y": 183.11717132095936
        }
      }
    }
  },
  "nuri": {
    "front": {
      "l": {
        "grip": [
          372.0,
          921.5
        ],
        "follow": {
          "x": -45.3,
          "y": 103.8597495775708
        }
      },
      "r": {
        "grip": [
          885.5,
          922.5
        ],
        "follow": {
          "x": 47.85,
          "y": 103.89174495232463
        }
      }
    },
    "q": {
      "l": {
        "grip": [
          376.0,
          755.0
        ],
        "follow": {
          "x": -46.3125,
          "y": 102.60697615818252
        }
      },
      "r": {
        "grip": [
          757.5,
          738.0
        ],
        "follow": {
          "x": 51.834375,
          "y": 106.92349042631332
        }
      }
    },
    "side": {
      "r": {
        "grip": [
          520.0,
          755.5
        ],
        "follow": {
          "x": 0.35707656612529,
          "y": 104.95990913247466
        }
      }
    }
  },
  "sabir": {
    "front": {
      "r": {
        "grip": [
          908.5,
          399.0
        ],
        "follow": {
          "x": 123.80000000000001,
          "y": 129.6571494272149
        }
      }
    },
    "q": {
      "l": {
        "grip": [
          331.0,
          688.0
        ],
        "follow": {
          "x": -38.205636978579484,
          "y": 97.87569823143214
        }
      },
      "r": {
        "grip": [
          905,
          665
        ],
        "follow": {
          "x": 160,
          "y": 220
        }
      }
    },
    "side": {
      "r": {
        "grip": [
          570.0,
          727.0
        ],
        "follow": {
          "x": 26.520223463687152,
          "y": 91.23207288083506
        }
      }
    }
  },
  "safi": {
    "front": {
      "l": {
        "grip": [
          270.0,
          866.5
        ],
        "follow": {
          "x": -70.0,
          "y": 36.161565829641724
        }
      },
      "r": {
        "grip": [
          763.0,
          599.0
        ],
        "follow": {
          "x": 83.60000000000001,
          "y": 57.65404235113722
        }
      }
    },
    "q": {
      "l": {
        "grip": [
          244.5,
          761.0
        ],
        "follow": {
          "x": -59.07906976744186,
          "y": 19.646699936491473
        }
      },
      "r": {
        "grip": [
          830,
          782
        ],
        "follow": {
          "x": 112,
          "y": 28
        }
      }
    }
  }
};

// ฟาฮีม (qalam) — ชุดมุม front/q/side/back ทำใน FILM-SLEEP-1 (16 พ.ย. 2026) จากดีไซน์เดิม output/car-hf/help-friend/assets/kits/qalam
// grip = กลางก้ามมือในพิกเซล rig · follow = ระยะจากฐานลำตัวถึงเป้าที่สเกล .45 (ปรับต่อเรื่องได้)
CAST.qalam={scale:.45,shadow:230,shadowMode:'ellipse',blink:2.2,blinkEvery:6.4,viewScale:{},wheels:{}};
{const S=.45,g=944,arm=(ax,gx,gy)=>({grip:[gx,gy],follow:{x:(gx-ax)*S,y:(g-gy)*S}});
 ARM_PROFILES.qalam={
  q:{l:arm(498,322,745),r:arm(498,672,745)},
  front:{l:arm(512,338,725),r:arm(512,690,725)},
  side:{l:arm(512,519,725),r:arm(512,511,725)},
  back:{l:arm(512,336,740),r:arm(512,689,740)},
 };}
for(const [id,c] of Object.entries(CAST))c.arms=ARM_PROFILES[id];
for(const id of Object.keys(CAST))if(!kits[id])delete CAST[id];
