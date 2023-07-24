class NovasTerminal {
    constructor() {
        this.facilities = 1
        this.facilitycap = 100

        this.powercapacity = 0
        this.powercreated = 0
        this.powerconsumed = 0
        this.powerremaining = 0

        this.num_goldgens = 0
        this.num_drills = 0
        this.num_t1 = 0
        this.num_twhet = 0

        this.num_powercells = 0
        this.num_grids = 0
    }

    // [0]Gold, [1]Pentagons, [2]Octagons, [3]Ch1Stacks, [4]WhetStacks
    _compute_output_daily() {
        return [24000*this.num_goldgens,8*this.num_drills,8*this.num_drills/(5*5*5),24*this.num_t1,8*this.num_twhet]
    }
    _compute_output_max_capacity() {
        return [60000*this.num_goldgens,10*this.num_drills,10*this.num_drills/(5*5*5),10*this.num_t1,10*this.num_twhet]
    }
    get_daily_output() {
        const [gold, pentagons, octagons, ch1mats, whetstones] = this._compute_output_daily();
        return `${gold.toLocaleString("en-US")} Gold<br/>${pentagons} Pentagons ⇒ ${octagons} Octagons<br/>${ch1mats} stacks of Ch.1 Mats<br/>${whetstones} stacks of Whetstones`
    }
    get_max_capacity_output() {
        const [gold, pentagons, octagons, ch1mats, whetstones] = this._compute_output_max_capacity();
        return `${gold.toLocaleString("en-US")} Gold<br/>${pentagons} Pentagons ⇒ ${octagons} Octagons<br/>${ch1mats} stacks of Ch.1 Mats<br/>${whetstones} stacks of Whetstones`
    }

    _compute_stats() {
        // Usage
        this.powerconsumed = 2*this.num_goldgens+3*this.num_drills+7*this.num_t1+10*this.num_twhet;

        // Compute minimum cells & grids
        this.num_powercells = Math.ceil(this.powerconsumed/5);
        this.num_grids = Math.ceil(this.powerconsumed/8);

        // Fill rest of stats
        this.facilities = 1+this.num_goldgens+this.num_drills+this.num_t1+this.num_twhet+this.num_powercells+this.num_grids;
        this.powercapacity = this.num_grids*8;
        this.powercreated = this.num_powercells*5;
        this.powerremaining = Math.min(this.powercapacity,this.powercreated)-this.powerconsumed;
    }

    // gold, drill, t1, tw
    add_facility(name) {
        if (name === "gold") {
            this.num_goldgens += 1;
        } else if (name === "drill") {
            this.num_drills += 1;
        } else if (name === "t1") {
            this.num_t1 += 1;
        } else if (name === "tw") {
            this.num_twhet += 1;
        }
        this._compute_stats()
    }
    rem_facility(name) {
        if (name === "gold") {
            this.num_goldgens = max(0,this.num_goldgens-1);
        } else if (name === "drill") {
            this.num_drills = max(0,this.num_drills-1);
        } else if (name === "t1") {
            this.num_t1 = max(0,this.num_t1-1);
        } else if (name === "tw") {
            this.num_twhet = max(0,this.num_twhet-1);
        }
        this._compute_stats()
    }
    set_facility(name,count) {
        if (count<0) {
            this._compute_stats()
            return;
        }
        if (name === "gold") {
            this.num_goldgens = count;
        } else if (name === "drill") {
            this.num_drills = count;
        } else if (name === "t1") {
            this.num_t1 = count;
        } else if (name === "tw") {
            this.num_twhet = count;
        }
        this._compute_stats()
    }
}

const novasTerminal = new NovasTerminal();



// Fields to update
const facilitiescount = document.getElementById("facilitiescount");
const powercapacity = document.getElementById("powercapacity");
const powercreated = document.getElementById("powercreated");
const powerconsumed = document.getElementById("powerconsumed");
const powerremaining = document.getElementById("powerremaining");

const num_goldgens = document.getElementById("num_goldgens");
const num_drills = document.getElementById("num_drills");
const num_t1 = document.getElementById("num_t1");
const num_twhet = document.getElementById("num_twhet");
const num_powercells = document.getElementById("num_powercells");
const num_grids = document.getElementById("num_grids");

const daily_output = document.getElementById("daily_output");
const max_output = document.getElementById("max_output");

// Event listeners
const goldSub = document.getElementById("goldSub");
const goldAdd = document.getElementById("goldAdd");
const drillSub = document.getElementById("drillSub");
const drillAdd = document.getElementById("drillAdd");
const tmk1Sub = document.getElementById("tmk1Sub");
const tmk1Add = document.getElementById("tmk1Add");
const twhetSub = document.getElementById("twhetSub");
const twhetAdd = document.getElementById("twhetAdd");

function updateDisplay() {
    // Change color if overloaded
    if (novasTerminal.facilities > novasTerminal.facilitycap) {
        document.body.style.color = "#9D4230"
        document.body.style.background = "#080E0F"
    } else {
        document.body.style.color = "#62BDCF"
        document.body.style.background = "#1A2F3E"
    }

    facilitiescount.innerHTML = `${novasTerminal.facilities}/${novasTerminal.facilitycap}`;
    powercapacity.innerHTML = `${novasTerminal.powercapacity}`;
    powercreated.innerHTML = `${novasTerminal.powercreated}`;
    powerconsumed.innerHTML = `${novasTerminal.powerconsumed}`;
    powerremaining.innerHTML = `${novasTerminal.powerremaining}`;

    num_goldgens.innerHTML = `${novasTerminal.num_goldgens}x`;
    num_drills.innerHTML = `${novasTerminal.num_drills}x`;
    num_t1.innerHTML = `${novasTerminal.num_t1}x`;
    num_twhet.innerHTML = `${novasTerminal.num_twhet}x`;
    num_powercells.innerHTML = `${novasTerminal.num_powercells}x`;
    num_grids.innerHTML = `${novasTerminal.num_grids}x`;

    daily_output.innerHTML = `${novasTerminal.get_daily_output()}`
    max_output.innerHTML = `${novasTerminal.get_max_capacity_output()}`
}

goldSub.addEventListener("click", () => {
    novasTerminal.rem_facility("gold");
    updateDisplay();
});
drillSub.addEventListener("click", () => {
    novasTerminal.rem_facility("drill");
    updateDisplay();
});
tmk1Sub.addEventListener("click", () => {
    novasTerminal.rem_facility("t1");
    updateDisplay();
});
twhetSub.addEventListener("click", () => {
    novasTerminal.rem_facility("tw");
    updateDisplay();
});
goldAdd.addEventListener("click", () => {
    novasTerminal.add_facility("gold");
    updateDisplay();
});
drillAdd.addEventListener("click", () => {
    novasTerminal.add_facility("drill");
    updateDisplay();
});
tmk1Add.addEventListener("click", () => {
    novasTerminal.add_facility("t1");
    updateDisplay();
});
twhetAdd.addEventListener("click", () => {
    novasTerminal.add_facility("tw");
    updateDisplay();
});