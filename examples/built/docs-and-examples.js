/* @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function createSubcategorySidebar(subcategory, lowerCaseTitle) {
    const lowerCaseKey = getLowerCaseKey(subcategory);
    const headerId = lowerCaseTitle.concat('-', lowerCaseKey, '-sidebar');
    const aHref = lowerCaseTitle.concat('-', lowerCaseKey);
    return `
<div class="subCategory" id=${'subCategory'.concat(subcategory)}>
  <h4 class="subcategory-header" id=${headerId}>
    <a class="darken" href="#${aHref}">${subcategory}</a>
  <h4>
</div>`;
}
function createSidebar(category, docsOrExamples) {
    if (docsOrExamples === 'examples')
        return;
    const container = document.getElementById('sidebar-category-container');
    const lowerCaseTitle = category.Title.toLowerCase();
    let subcategories = Object.keys(category);
    subcategories = subcategories.filter(k => k !== 'Title');
    const categoryContainer = `
<div class="category" id=${lowerCaseTitle.concat('aboveHeader')}>
  <h3 id=${lowerCaseTitle.concat('-sidebar')}>
    <a class="darken" href="#${lowerCaseTitle}">${category.Title}</a>
  <h3>
</div>`;
    container.innerHTML += categoryContainer;
    const innerCategory = document.getElementById(lowerCaseTitle.concat('aboveHeader'));
    for (const subcategory of subcategories) {
        innerCategory.innerHTML +=
            createSubcategorySidebar(subcategory, lowerCaseTitle);
        const innerSubcategory = document.getElementById(lowerCaseTitle.concat('aboveHeader'));
        const lowerCaseKey = getLowerCaseKey(subcategory);
        const entries = category[subcategory];
        for (const entry of entries) {
            const divId = lowerCaseTitle.concat('-', lowerCaseKey, '-', entry.htmlName);
            const aId = '#docs-'.concat(lowerCaseTitle, '-', lowerCaseKey, '-', entry.htmlName);
            innerSubcategory.innerHTML += `
<div class="element de-active" id=${divId}>
  <a class="darken" href=${aId}>${entry.name}</a>
</div>`;
        }
    }
}
function createTitle(header, docsOrExamples) {
    const name = docsOrExamples === 'docs' ? '-docs' : '-examples-header';
    const titleContainer = document.getElementById(header.toLowerCase().concat(name));
    const title = `
<div class="header">
  <h1 id=${header.toLowerCase()}>${header}<h1>
</div>`;
    titleContainer.innerHTML += title;
}
function getLowerCaseKey(key) {
    if (key === 'CSS Custom Properties') {
        return 'cssProperties';
    }
    else {
        return key.toLowerCase();
    }
}
function createDefaultTable(entry) {
    return `
<table class="value-table">
  <tr>
    <th>Default value</th>
    <th>Type</th>
    <th>Options</th>
  </tr>
  <tr>
    <td>${entry.default[0]}</td>
    <td>${entry.default[1]}</td>
    <td>${entry.default[2]}</td>
  </tr>
</table>`;
}
function createLinks(entry, pluralLowerCaseSubcategory, lowerCaseCategory) {
    const ulId = 'links'.concat(entry.htmlName, pluralLowerCaseSubcategory, lowerCaseCategory);
    return `
<div>
  <ul class="links" id=${ulId}>
  </ul>
</div>`;
}
function createEntry(entry, lowerCaseCategory, pluralLowerCaseSubcategory) {
    const lowerCaseSubcategory = pluralLowerCaseSubcategory.slice(0, -1);
    const subcategoryNameId = [
        'docs',
        lowerCaseCategory,
        pluralLowerCaseSubcategory,
        entry.htmlName
    ].join('-');
    const links = 'links' in entry ?
        createLinks(entry, pluralLowerCaseSubcategory, lowerCaseCategory) :
        '';
    const entryContainer = `
<div class=${lowerCaseSubcategory.concat('-container')}>
  <div class=${lowerCaseSubcategory.concat('-name')} id=${subcategoryNameId}>
    <h4>${entry.name}</h4>
  </div>
  <div class=${lowerCaseSubcategory.concat('-definition')}>
    <p>${entry.description}</p>
  </div>
  ${'default' in entry ? createDefaultTable(entry) : ''}
  ${links}
</div>`;
    return entryContainer;
}
function createSubcategory(subcategoryArray, category, subcategory, pluralLowerCaseSubcategory) {
    const lowerCaseCategory = category.toLowerCase();
    const element = document.getElementById(lowerCaseCategory.concat('-docs'));
    const subcategoryContainerId = 'docs-'.concat(lowerCaseCategory, '-', pluralLowerCaseSubcategory);
    const subcategoryContainer = `
<div class=${pluralLowerCaseSubcategory.concat('-container')}>
  <div class='inner-content'>
    <div id=${subcategoryContainerId}>
      <h3 id=${lowerCaseCategory.concat('-', pluralLowerCaseSubcategory)}>
        ${subcategory}
      </h3>
    </div>
  </div>
</div>`;
    element.innerHTML += subcategoryContainer;
    const innerSubcategoryContainer = document.getElementById(subcategoryContainerId);
    for (const entry of subcategoryArray) {
        innerSubcategoryContainer.innerHTML +=
            createEntry(entry, lowerCaseCategory, pluralLowerCaseSubcategory);
        if ('links' in entry) {
            const ulId = 'links'.concat(entry.htmlName, pluralLowerCaseSubcategory, lowerCaseCategory);
            const ul = document.getElementById(ulId);
            for (const link of entry.links) {
                ul.innerHTML += `<li>${link}</li>`;
            }
        }
    }
}
function convertJSONToHTML(json, docsOrExamples) {
    let header = '';
    for (const category of json) {
        for (const key in category) {
            if (key === 'Title') {
                header = category[key];
                createTitle(category[key], docsOrExamples);
            }
            else if (docsOrExamples === 'docs') {
                const lowerCaseKey = getLowerCaseKey(key);
                createSubcategory(category[key], header, key, lowerCaseKey);
            }
        }
        createSidebar(category, docsOrExamples);
    }
}

/* @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let globalCurrentView = [];
let previouslyActive = '';
let toRemove = '';
let order = []; // TODO, switch to dictionary
let isFirstOpen = true; // is true on the first observation of all entries
let everyEntry = []; // a list of all attributes/properties etc.
function activateSidebar(sidebarIds) {
    document.querySelector(`div[id=${sidebarIds.name}]`).classList.add('active');
    document.querySelector(`h4[id=${sidebarIds.subcategory}]`).classList.add('active');
    document.querySelector(`h3[id=${sidebarIds.category}]`).classList.add('active');
}
function deactivateSidebar(sidebarIds) {
    document.querySelector(`div[id=${sidebarIds.name}]`).classList.remove('active');
    document.querySelector(`h4[id=${sidebarIds.subcategory}]`).classList.remove('active');
    document.querySelector(`h3[id=${sidebarIds.category}]`).classList.remove('active');
}
function addDeactive(sidebarName) {
    document.querySelector(`div[id=${sidebarName}]`).classList.add('de-active');
}
function removeDeactive(sidebarName) {
    document.querySelector(`div[id=${sidebarName}]`).classList.remove('de-active');
}
function getSidebarCategoryForNewPage() {
    return previouslyActive[0];
}
function getSidebarIdsFromSidebarName(name) {
    const sb = 'sidebar';
    const sidebarName = name;
    let sidebarSub = sidebarName.split('-').slice(0, 2);
    let sidebarCat = sidebarName.split('-').slice(0, 1);
    sidebarSub.push(sb);
    const sidebarSubcategory = sidebarSub.join('-');
    sidebarCat.push(sb);
    const sidebarCategory = sidebarCat.join('-');
    return {
        name: sidebarName,
        subcategory: sidebarSubcategory,
        category: sidebarCategory
    };
}
function getSidebarIdsFromId(id) {
    const sb = 'sidebar';
    const sidebarName = id.split('-').slice(1, 10).join('-');
    let sidebarSub = id.split('-').slice(1, 3);
    let sidebarCat = id.split('-').slice(1, 2);
    sidebarSub.push(sb);
    const sidebarSubcategory = sidebarSub.join('-');
    sidebarCat.push(sb);
    const sidebarCategory = sidebarCat.join('-');
    return {
        name: sidebarName,
        subcategory: sidebarSubcategory,
        category: sidebarCategory
    };
}
/*
 * sidebarSubcategory: string of the old subcategory being replaced
 * newSidebarSubcategory: string of the new subcategory
 * example:
 *  sidebarSubcategory = loading-attributes
 *  newSidebarSubcategory = loading-cssProperties
 */
function updateSidebarView(sidebarSubcategory, newSidebarSubcategory) {
    if (sidebarSubcategory !== newSidebarSubcategory) {
        for (const entry of everyEntry) {
            const id = entry.target.getAttribute('id');
            const sidebarIds = getSidebarIdsFromId(id);
            const currentSidebarName = sidebarIds.name;
            if (sidebarIds.subcategory !== newSidebarSubcategory) {
                addDeactive(currentSidebarName);
            }
            else {
                removeDeactive(currentSidebarName);
            }
        }
    }
}
/*
 * Hide all of the entries not within the current subcategory
 */
function updateSidebarViewFirstTime(entries) {
    isFirstOpen = false; // global
    everyEntry = entries; // Sets global variable for use in updateSidebarView
    const sidebarIds = getSidebarIdsFromSidebarName(previouslyActive);
    updateSidebarView('', sidebarIds.subcategory);
}
function updateFromOldToNew(prev, sidebarIds) {
    const prevSidebarIds = getSidebarIdsFromSidebarName(prev);
    deactivateSidebar(prevSidebarIds);
    activateSidebar(sidebarIds);
    updateSidebarView(prevSidebarIds.subcategory, sidebarIds.subcategory);
}
function removeActiveEntry(sidebarIds) {
    deactivateSidebar(sidebarIds);
    if (globalCurrentView.length >= 2) {
        const newSidebarIds = getSidebarIdsFromSidebarName(globalCurrentView[1]);
        activateSidebar(newSidebarIds);
        updateSidebarView(sidebarIds.subcategory, newSidebarIds.subcategory);
        previouslyActive = newSidebarIds.name;
    }
}
function handleHTMLEntry(htmlEntry) {
    const id = htmlEntry.target.getAttribute('id');
    const sidebarIds = getSidebarIdsFromId(id);
    // entry inside viewing window
    if (htmlEntry.intersectionRatio > 0) {
        if (toRemove.length > 0) {
            // inside a large div
            updateFromOldToNew(toRemove, sidebarIds);
            toRemove = '';
        }
        else if (globalCurrentView.length === 0) {
            // empty globalCurrentView, add to view
            activateSidebar(sidebarIds);
            previouslyActive = sidebarIds.name;
            globalCurrentView.push(sidebarIds.name);
        }
        else if (order.indexOf(previouslyActive) > order.indexOf(sidebarIds.name)) {
            // scrolling up
            updateFromOldToNew(globalCurrentView[0], sidebarIds);
            globalCurrentView.unshift(sidebarIds.name);
            previouslyActive = sidebarIds.name;
        }
        else {
            // an entry is in view under the current active entry
            globalCurrentView.push(sidebarIds.name);
        }
    }
    else if (globalCurrentView.length === 1) {
        // entry outside viewing window, but entry is the only element
        toRemove = previouslyActive;
    }
    else {
        // entry outside viewing window, active entry now out of view
        if (previouslyActive === sidebarIds.name) {
            // entry being removed from view is currently active
            removeActiveEntry(sidebarIds);
        }
        // always remove entry when out of view
        globalCurrentView = globalCurrentView.filter(e => e !== sidebarIds.name);
    }
}
/*
 * for page jump its just easier to restart, so deactivate everything, clear
 * the global view, then only update with whats in view
 */
function handlePageJump(entries) {
    globalCurrentView = [];
    toRemove = '';
    previouslyActive = '';
    updateSidebarView('', 'null');
    for (const htmlEntry of entries) {
        const id = htmlEntry.target.getAttribute('id');
        const sidebarIds = getSidebarIdsFromId(id);
        deactivateSidebar(sidebarIds);
    }
    let isAtTop = true;
    for (const htmlEntry of entries) {
        if (htmlEntry.intersectionRatio > 0) {
            if (isAtTop) {
                isAtTop = false;
                const id = htmlEntry.target.getAttribute('id');
                const sidebarIds = getSidebarIdsFromId(id);
                updateSidebarView('', sidebarIds.subcategory);
            }
            handleHTMLEntry(htmlEntry);
        }
    }
}
/*
 * Update the table of contents based on how the page is viewed.
 */
function sidebarObserver(docsOrExamples) {
    if (docsOrExamples === 'docs') {
        const observer = new IntersectionObserver(entries => {
            if (!isFirstOpen && entries.length > 2) {
                handlePageJump(entries);
            }
            else {
                for (const htmlEntry of entries) {
                    handleHTMLEntry(htmlEntry);
                }
            }
            // First time all of the observers are set entries will be every entry.
            if (isFirstOpen) {
                updateSidebarViewFirstTime(entries);
            }
        });
        // TODO: update for docs/examples, in examples we may want to use specific
        // examples or headers.
        // Fill the observer with the necessary divs to observe:
        // i.e. attributes, properties, events, methods, slots, custom css.
        document.querySelectorAll('div[id*="docs"]').forEach((section) => {
            const idSplitList = section.getAttribute('id').split('-');
            if (idSplitList.length === 4) {
                order.push(idSplitList.slice(1, 10).join('-'));
                observer.observe(section);
            }
        });
    }
}

/* @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function switchPages(oldType, newType) {
    if (oldType !== newType) {
        // TODO: Handle going from examples back to docs (old state), possibly
        // include a previous state to revert to in URI
        const newSidebarCategory = getSidebarCategoryForNewPage();
        const newURI = '../'.concat(newType, '/#', newSidebarCategory);
        const d = document.createElement('a');
        d.setAttribute('href', newURI);
        window.location.href = d.href;
    }
}
window.onscroll = function () {
    stickyHeader();
};
function stickyHeader() {
    const headers = document.getElementsByClassName('header');
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const sticky = header.offsetTop;
        if (window.pageYOffset > sticky) {
            header.classList.add('sticky');
        }
        else {
            header.classList.remove('sticky');
        }
    }
}
async function fetchHtmlAsText(url) {
    const response = await fetch(url);
    return await response.text();
}
async function loadExamples() {
    const loadingExample = document.getElementById('loading-examples');
    loadingExample.innerHTML =
        await fetchHtmlAsText('../examples/lazy-loading.html');
}
function loadJSON(filePath, callback) {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', filePath, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
/*
 * On a page load if # is given, jump to section
 */
function jumpToSection() {
    const windowHref = window.location.href;
    const hashtagIndex = windowHref.indexOf('#');
    if (hashtagIndex >= 0 && windowHref.length > hashtagIndex) {
        const jumpToId = windowHref.slice(hashtagIndex + 1);
        const element = document.getElementById(jumpToId);
        if (element) {
            const fakeA = document.createElement('a');
            fakeA.href = '#'.concat(jumpToId);
            fakeA.click();
        }
    }
}
/* Load the JSON asynchronously, then generate the sidebarObserver after all the
 * documentation in the window.
 * docsOrExamples: 'docs' or 'examples'
 */
function init(docsOrExamples) {
    loadJSON('../data/loading.json', function (response) {
        const actualJSON = JSON.parse(response);
        convertJSONToHTML(actualJSON, docsOrExamples);
        if (docsOrExamples === 'examples') {
            loadExamples();
        }
        sidebarObserver(docsOrExamples);
        jumpToSection();
    });
}
self.switchPages = switchPages;
self.init = init;
//# sourceMappingURL=docs-and-examples.js.map
