let subclasses = [
    ["Misc", "None", "Peasant", "Duke"],
    ["Archer", "Longbowman", "Crossbowman", "Skirmisher"],
    ["Vanguard", "Devastator", "Raider", "Ambusher"],
    ["Footman", "Poleman", "Man At Arms", "Field Engineer"],
    ["Knight", "Crusader", "Guardian", "Officer"],
];

let classImages = [
    // 'https://lh3.googleusercontent.com/drive-viewer/AFGJ81roUyXTavsedP4k6FiS3e1UEK1o2ziwylmm0EDX2_4Fh1kciOCWB7s2iVD8U_vQ73QlcPmPQIyK0NAO651IBUlTnxQKyw',
    //'https://lh3.googleusercontent.com/drive-viewer/AFGJ81p4cS1MltDzGnBzGpIPqcXLV9mCWUTCMi02WEeiXUoaLbH_AdxtV3EB8FwqGPbvi0M0r_CPmSsL_o4fcU5LiTNvbage',
    '',
    'https://lh3.googleusercontent.com/drive-viewer/AFGJ81q06f33VzQIub2c-Yf3dmBwL_bwQg9b0PVjoWJISOR-kq65p-YZ71yieDq6h2ZDSTBj1Nzzco4QP4khfdtgb4h4r6lrpg',
    'https://lh3.googleusercontent.com/drive-viewer/AFGJ81rpKNiHzJU6gdQxPdKeugN5n4p433I4hJTKpI0O0gQXv61Q8NYOvnx1dayKzLXE3WBe95HMsdk-eBIVZAK0yLu6UJfR',
    'https://lh3.googleusercontent.com/drive-viewer/AFGJ81qtJ8r5t-Pr2UvwY9lhK3lkZvPS4Iiz48Itig3lgDeWlB3pqETN_FSq0Kuns7qVyGaw7THuEyD52daihKmAdZPka2Pfeg',
    'https://lh3.googleusercontent.com/drive-viewer/AFGJ81r_0zpkvt-3wqPbekZietC-xFimrJLaaLroXCyaf9jL8PpvP16NUbPbKqVU_w9bLNWsVW8EE673_aitGf8IIf5YAVcX',
];

let cats = [
    "Rare Stats",
    "FFA Positions",
    "Matches",
    "Other",
    "Class Breakdown",
    "Weapon Breakdown",
];
// http://127.0.0.1:5500/clean/index.html?
let prefixes = [
    "FFA",
    "Wins",
    "Losses",
    "SubClass", // TD K D time
    "Weapon", // TK K D
    "Common",
    "MatchesCompleted"
];

let suffixes = [
    "Kills",
    "Deaths",
    "Takedowns",
    "Playtime",
];

let parsedData = [];
let loadDataCat = [];
let loadDataPrefix = [];
let acc = document.getElementById('accordionExample');

function camelCaseSplit(title, skip)
{
    text = title.substring(skip);
    //https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-title-case-text
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}
function parseU4 (data, offset) {
    return (
      (data[offset + 3] << 24) |
      (data[offset + 2] << 16) |
      (data[offset + 1] << 8) |
      data[offset]
    );
  }
Uint8Array.prototype.indexOfMulti = function (searchElements, fromIndex) {
    fromIndex = fromIndex || 0;

    var index = Array.prototype.indexOf.call(this, searchElements[0], fromIndex);
    if (searchElements.length === 1 || index === -1) {
        // Not found or no other elements to check
        return index;
    }

    for (var i = index, j = 0; j < searchElements.length && i < this.length; i++, j++) {
        if (this[i] !== searchElements[j]) {
            return this.indexOfMulti(searchElements, index + 1);
        }
    }

    return (i === index + searchElements.length) ? index : -1;
};
function parseFile() {
    
    parsedData = [];
    //parsedDataPrefix = [];
    // for (let i=0; i<prefixes.length; ++i) {
    //     parsedData[i] = new Array();
    // }
    
    // for (p in prefixes) {
    //     parsedDataPrefix[prefixes[p]] = new Array();
    // }

    const fileInput = document.getElementById('file-selector');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
        const binaryData = new Uint8Array(event.target.result);

        let lastIdx = 0;
        for (e in entryNames) {
            let prefix = -1;
            let prefixS = "";
            // see if any prefix matches
            for (p in prefixes) {
                if (entryNames[e].indexOf(prefixes[p], 0) >= 0) {
                    prefix = parseInt(p);
                    prefixS = prefixes[p];
                    break;
                }
            }

            // get index of entry in our string
            let idx = binaryData.indexOfMulti(new TextEncoder("utf-8").encode(entryNames[e]), lastIdx);
            if (idx > 0) {
                lastIdx = idx + entryNames[e].length;
                let val = parseU4(binaryData, lastIdx+1);
                if (entryNames[e].toUpperCase().indexOf("TIME") != -1)
                {
                    val = Math.round(val / 60 / 60) + "h " +
                    Math.round((val / 60) %60) + " m " +
                    Math.round(val % 60) + " s "
                }
                if (prefix >= 0){
                    let name = entryNames[e];
                    if (false && name.length > prefixS.length)
                        name = name.slice(prefixS.length);
                    //parsedDataPrefix[prefixS].push(name);
                }
                parsedData[entryNames[e]] = val;
            }
        }
        console.log(parsedData);
        //console.log(parsedDataPrefix);
    });

    reader.readAsArrayBuffer(file);
}



function createAccItem(p, heading){

    let acc_item = document.createElement('div');
    acc_item.className = 'accordion-item';

    let header = document.createElement('h2');
    header.id = "heading" + p;
    header.className = 'accordion-header';

    let btn = document.createElement('button');
    //btn.id = "heading" + p;
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "collapse" + p);
    btn.setAttribute("data-bs-toggle", "collapse");
    btn.setAttribute("data-bs-target", "#collapse" + p);
    btn.className = 'accordion-button collapsed';
    btn.type = "button"
    btn.innerText = heading;

    let collapse = document.createElement('div');
    collapse.id = "collapse" + p;
    collapse.setAttribute("aria-labelledby", "heading" + p);
    collapse.setAttribute("data-bs-parent", "#parseAccordion");
    collapse.className = 'accordion-collapse collapse';

    let accBody = document.createElement('div');
    accBody.className = 'accordion-body';
    
    let cont = document.createElement('div');
    cont.className = 'container';
    let row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-3 g-4';

    cont.appendChild(row);
    accBody.appendChild(cont);
    collapse.appendChild(accBody);
    header.appendChild(btn);
    acc_item.appendChild(header);
    acc_item.appendChild(collapse);
    acc.appendChild(acc_item);
};

function createCard(container, ttitle, data)
{
    let col = document.createElement('div');
    col.className = 'col';// shadow cursor-pointer';

    let card = document.createElement('div');
    card.className = 'card text-center c_card_data';// shadow cursor-pointer';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let title = document.createElement('div');
    title.innerText = ttitle;
    title.className = 'card-title c_number_text';

    let color = document.createElement('div');
    color.innerText = data;
    color.className = 'card-text c_number_text';

    cardBody.appendChild(title);
    cardBody.appendChild(color);
    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
}

function createStatAccordion2() {
    // Common
    let container = document.getElementById("collapse3");
    
    for (i in loadDataPrefix['Common']){
            createCard(container.firstChild.firstChild.firstChild, camelCaseSplit(loadDataPrefix['Common'][i], 0), "0");
    }
    //container.classList.add("show");
    // Matches
    container = document.getElementById("collapse2");
    
    for (i in loadDataPrefix['MatchesCompleted']){
        let target = container.firstChild.firstChild.firstChild;
        let val = loadDataPrefix['MatchesCompleted'][i]
        createCard(target, camelCaseSplit(i), val);
    }
    //container.classList.add("show");
    // FFA
    container = document.getElementById("collapse1");
    
    for (i in loadDataPrefix['FFA']){
        let target = container.firstChild.firstChild.firstChild;
        let val = loadDataPrefix['FFA'][i]
        createCard(target, camelCaseSplit(i), val);
    }
    //container.classList.add("show");
    // SubClass
    container = document.getElementById("collapse4");
    
    for (i in loadDataPrefix['SubClass']){
        let target = container.firstChild.firstChild.firstChild;
        let val = loadDataPrefix['SubClass'][i]
        let temp = []
        for (v in val)
            temp.push(val[v]);
        createCard(target, camelCaseSplit(i), temp);
    }
    // container.classList.add("show");
    // Weapon
    container = document.getElementById("collapse5");
    
    for (i in loadDataPrefix['Weapon']){
        let target = container.firstChild.firstChild.firstChild;
        let val = loadDataPrefix['Weapon'][i]
        let temp = []
        for (v in val)
            temp.push(val[v]);
        createCard(target, camelCaseSplit(i), temp);
    }
    // container.classList.add("show");
    
}


function createMainCard(container, id, ttitle, image)
{
    let col = document.createElement('div');
    col.className = 'py-2';// shadow cursor-pointer';
    let card = document.createElement('div');
    card.className = 'card c_card_base img-fluid';// shadow cursor-pointer';

    let header = document.createElement('div');
    header.className = 'card-header text-center c_title_text';
    header.innerText = ttitle;

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';


    let title = document.createElement('div');
    // title.innerText = ttitle;
    title.className = 'card-title';

    let color = document.createElement('div');
    // color.innerText = "data";
    color.className = 'card-text';

    let cont = document.createElement('div');
    cont.className = 'container';
    let row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-3 g-4';
    row.id = 'mainCard'+id;
    if (image)
    {
        let img = document.createElement('img');
        img.className = 'card-img-top img-fluid';
        img.src = image;   
        
        let title2 = document.createElement('div');
        title2.className = 'card-img-overlay text-center mt-4';

        title.innerText = ttitle;
        title2.appendChild(title);
        
        card.appendChild(img); 
        card.appendChild(title2);
    }
    else
    {
        cardBody.appendChild(title);
        card.appendChild(header);
    }

    cont.appendChild(row);
    cardBody.appendChild(cont);
    cardBody.appendChild(color);
    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
    return cont;
}

function createStatAccordion() {

    for (i in loadDataPrefix)
    {
        let itr = -1;//prefixes.indexOf(i);
        switch (i) {
            case "Wins":
            case "Losses":  itr = 1;  break;
            case "FFA": itr = 1; break;
            case "MatchesCompleted": itr = 2;  break;
            case "Common": itr = 3;  break;
            case "SubClass":  itr = 4; break; // TD K D time
            case "Weapon":  itr = 5; break; // TK K D
                break;
            default:
                break;
        }

        if (itr == -1)
            continue;

        let container = document.getElementById('mainCard'+itr.toString());
        switch (i) {
            case "FFA":
            case "Common":
            case "MatchesCompleted":
                {
                    for (j in loadDataPrefix[i]){
                        let target = container;
                        let val = loadDataPrefix[i][j]
                        createCard(target, camelCaseSplit(j), val);
                    }
                    break;
                }
            case "Wins":
            // case "Losses":
                {
                    break;
                }
            case "SubClass": // TD K D time
                {
                    for (c in subclasses)
                    {
                        let cardBody = document.createElement('div');
                        cardBody.className = 'row row-cols-3';
                        let img = document.createElement('img');
                        img.className = 'card-img-top';
                        img.src = classImages[c];
                        
                        let col = createMainCard(container.parentElement, 1+c, subclasses[c][0], img.src);
                        col.appendChild(cardBody);
                        for (r in subclasses[c].slice(1))
                        {
                            createCard(cardBody, subclasses[c][r], 0);
                        }
                        console.log(subclasses[c]);
                    }
                    break;
                }
            
            case "Weapon": // TK K D
                {
                    for (j in loadDataPrefix[i]){
                        let target = container;
                        let val = loadDataPrefix[i][j];
                        let temp = []
                        for (v in val)
                            temp.push(val[v]);
                        createCard(target, camelCaseSplit(j), temp);
                    }
                    break;
                } 
            default:
                break;
        }
    }
    return;
    
    // Common
    let container = document.getElementById("mainCard3");
    
    for (i in loadDataPrefix['Common']){
            createCard(container, camelCaseSplit(loadDataPrefix['Common'][i], 0), "0");
    }
    return;
    //container.classList.add("show");
    // Matches
    container = document.getElementById("collapse2");
    
    for (i in loadDataPrefix['MatchesCompleted']){
        let target = container.firstChild.firstChild.firstChild;
        let val = loadDataPrefix['MatchesCompleted'][i]
        createCard(target, camelCaseSplit(i), val);
    }
    //container.classList.add("show");
    // FFA
    container = document.getElementById("collapse1");
    
    for (i in loadDataPrefix['FFA']){
        let target = container.firstChild.firstChild.firstChild;
        let val = loadDataPrefix['FFA'][i]
        createCard(target, camelCaseSplit(i), val);
    }
    //container.classList.add("show");
    // SubClass
    container = document.getElementById("collapse4");
    
    for (i in loadDataPrefix['SubClass']){
        let target = container.firstChild.firstChild.firstChild;
        let val = loadDataPrefix['SubClass'][i]
        let temp = []
        for (v in val)
            temp.push(val[v]);
        createCard(target, camelCaseSplit(i), temp);
    }
    // container.classList.add("show");
    // Weapon
    container = document.getElementById("collapse5");
    
    for (i in loadDataPrefix['Weapon']){
        let target = container.firstChild.firstChild.firstChild;
        let val = loadDataPrefix['Weapon'][i]
        let temp = []
        for (v in val)
            temp.push(val[v]);
        createCard(target, camelCaseSplit(i), temp);
    }
    // container.classList.add("show");
    
}


window.onload = function(){
    acc = document.getElementById("parseAccordion");
    
    for (p in cats) {
        //createCard(acc, cats[p], parseInt(p));
        createMainCard(acc, parseInt(p), cats[p]);
    }
    // for (p in cats) {
    //     createAccItem(parseInt(p), cats[p]);
    // }
    for (p in prefixes) {
        loadDataPrefix[prefixes[p]] = new Array();
    }
    
    for (e in entryNames) {
        let prefix = -1;
        let prefixS = "";
        let suffix = -1;
        let suffixS = "";
        
        // see if any prefix matches
        for (p in prefixes) {
            if (entryNames[e].indexOf(prefixes[p], 0) >= 0) {
                prefix = parseInt(p);
                prefixS = prefixes[p];

                for (s in suffixes) {
                    if (entryNames[e].indexOf(suffixes[s], prefixS.length) >= 0) {
                        suffix = parseInt(s);
                        suffixS = suffixes[s];
                        break;
                    }
                }
                if (suffix == -1)
                {
                    let name = entryNames[e];
                    if (name.length > prefixS.length)
                        name = name.slice(prefixS.length);
                    loadDataPrefix[prefixS][name] = 0;
                }
                else
                {
                    // weapon / class name
                    let name = entryNames[e];
                    let len = prefixS.length + suffixS.length;
                    if (name.length > len)
                        name = name.slice(len);
                    if (!loadDataPrefix[prefixS][name])
                        loadDataPrefix[prefixS][name] = new Array();
                    loadDataPrefix[prefixS][name][suffixS] = 0;
                }
                    
                break;
            }
        }

        if (prefix == -1)
            loadDataPrefix['Common'][entryNames[e]] = 0;
        else {
            
        }
    }
    console.log(loadDataPrefix);
    createStatAccordion();
}