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
import { convertJSONToHTML } from './create-html';
import { getSidebarCategoryForNewPage, sidebarObserver } from './sidebar';
export function switchPages(oldType, newType) {
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
export async function loadExamples() {
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
export function init(docsOrExamples) {
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
//# sourceMappingURL=utils.js.map