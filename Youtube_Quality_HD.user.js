// ==UserScript==
// @name         Youtube Quality HD
// @version      1.0.0
// @description  Automatically select your desired video quality and select premium when posibble.
// @run-at       document-body
// @match        https://www.youtube.com/*
// @exclude      https://*.youtube.com/live_chat*
// @exclude      https://*.youtube.com/tv*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM.getValue
// @grant        GM.setValue
// @updateURL    https://github.com/fznhq/userscript-collection/raw/main/Youtube_Quality_HD.user.js
// @downloadURL  https://github.com/fznhq/userscript-collection/raw/main/Youtube_Quality_HD.user.js
// @author       Fznhq
// @namespace    https://github.com/fznhq
// @homepageURL  https://github.com/fznhq/userscript-collection
// @license      GNU GPLv3
// ==/UserScript==

// Icons provided by https://uxwing.com/

(async function () {
    "use strict";

    const listQuality = [144, 240, 360, 480, 720, 1080, 1440, 2160, 2880, 4320];
    const defaultPreferredQuality = 1080;

    let manualOverride = false;
    let currentMaxQuality = 0;

    const options = {
        preferred_quality: defaultPreferredQuality,
        preferred_premium: true,
        updated_id: "",
    };

    const icons = {
        premium: `{"svg":{"viewBox":"0 0 123 95"},"path":{"fill":"white","d":"M1 28 20 1a3 3 0 0 1 3-1h77a3 3 0 0 1 3 1l19 27a3 3 0 0 1 1 2 3 3 0 0 1-1 2L64 94a3 3 0 0 1-4 0L1 32a3 3 0 0 1-1-1 3 3 0 0 1 1-3Zm44 5 17 51 17-51Zm39 0L68 82l46-49ZM56 82 39 33H9l47 49ZM28 5l13 20L56 5Zm39 0 15 20L95 5Zm33 2L87 27h28L100 7ZM77 27 61 7 47 27Zm-41 0L22 7 8 27Z"}}`,
        quality: `{"svg":{"viewBox":"0 0 123 107"},"path":{"fill":"white","fill-rule":"evenodd","d":"M113 57a4 4 0 0 1 2 1l3 4a5 5 0 0 1 1 2 4 4 0 0 1 0 1 4 4 0 0 1 0 2 4 4 0 0 1-1 1l-3 2v1l1 1v2h3a4 4 0 0 1 3 1 4 4 0 0 1 1 2 4 4 0 0 1 0 1l-1 6a4 4 0 0 1-1 3 4 4 0 0 1-3 1h-3l-1 1-1 1v1l2 2a4 4 0 0 1 1 1 4 4 0 0 1-1 3 4 4 0 0 1-1 2l-4 3a4 4 0 0 1-1 1 4 4 0 0 1-2 0 5 5 0 0 1-1 0 4 4 0 0 1-2-1l-2-3a1 1 0 0 1 0 1h-3v3a4 4 0 0 1-1 2 4 4 0 0 1-1 1 4 4 0 0 1-1 1 4 4 0 0 1-2 0h-5a4 4 0 0 1-4-5v-3l-2-1-1-1-2 2a4 4 0 0 1-2 1 4 4 0 0 1-1 0 4 4 0 0 1-2 0 4 4 0 0 1-1-1l-4-4a5 5 0 0 1 0-2 4 4 0 0 1-1-2 4 4 0 0 1 2-3l2-2v-1l-1-2h-2a4 4 0 0 1-2-1 4 4 0 0 1-1-1 4 4 0 0 1-1-1 4 4 0 0 1 0-2v-5a4 4 0 0 1 1-2 5 5 0 0 1 1-1 4 4 0 0 1 1-1 4 4 0 0 1 2 0h3l1-1v-2l-1-2a4 4 0 0 1-1-1 4 4 0 0 1 0-2 4 4 0 0 1 0-2 4 4 0 0 1 1-1l4-3a5 5 0 0 1 2-1 4 4 0 0 1 1-1 4 4 0 0 1 2 1 4 4 0 0 1 1 1l2 2h2l1-1 1-2a4 4 0 0 1 0-2 4 4 0 0 1 1-1 4 4 0 0 1 2-1 4 4 0 0 1 1 0h6a5 5 0 0 1 1 1 4 4 0 0 1 2 1 4 4 0 0 1 0 1 4 4 0 0 1 1 2l-1 3h1l1 1 1 1 3-2a4 4 0 0 1 1-1 4 4 0 0 1 2 0 4 4 0 0 1 1 0ZM11 0h82a11 11 0 0 1 11 11v30h-1a11 11 0 0 0-2-1h-2V21H5v49h51a12 12 0 0 0 0 2v4h-1v11h4l1 1h1l-1 1a12 12 0 0 0 0 2v1H11A11 11 0 0 1 0 81V11A11 11 0 0 1 11 0Zm35 31 19 13a3 3 0 0 1 0 4L47 61a3 3 0 0 1-2 0 3 3 0 0 1-3-2V33l1-1a3 3 0 0 1 3-1Zm4 56V76H29v11ZM24 76H5v5a6 6 0 0 0 6 6h13V76Zm52-60V5H55v11Zm5-11v11h18v-5a6 6 0 0 0-6-6ZM50 16V5H29v11Zm-26 0V5H11a6 6 0 0 0-6 6v5Zm70 56a6 6 0 1 1-6 7 6 6 0 0 1 6-7Zm-1-8a14 14 0 1 1-13 16 14 14 0 0 1 13-16Z"}}`,
    };

    /**
     * @param {string} name
     * @param {boolean} value
     * @returns {boolean}
     */
    function saveOption(name, value) {
        GM.setValue(name, value);
        return (options[name] = value);
    }

    for (const name in options) {
        const saved_option = await GM.getValue(name);

        if (saved_option === undefined) {
            saveOption(name, options[name]);
        } else {
            options[name] = saved_option;
        }
    }

    /**
     * @param {string} name
     * @param {object} attributes
     * @param {Array} append
     * @returns {SVGElement}
     */
    function createNS(name, attributes = {}, append = []) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", name);
        for (const k in attributes) el.setAttributeNS(null, k, attributes[k]);
        return el.append(...append), el;
    }

    for (const name in icons) {
        const icon = JSON.parse(icons[name]);
        icons[name] = createNS("svg", icon.svg, [createNS("path", icon.path)]);
    }

    /**
     * @param {string} query
     * @param {boolean} cache
     * @returns {() => HTMLElement | null}
     */
    function $(query, cache = true) {
        let elem = null;
        return () => (cache && elem) || (elem = document.querySelector(query));
    }

    const element = {
        player: $("#movie_player"),
        settings: $(".ytp-settings-menu"),
        panel_settings: $(".ytp-settings-menu .ytp-panel-menu"),
        quality_menu: $(".ytp-quality-menu", false),
        video: $("#movie_player video"),
        // Reserve Element
        text_quality: document.createTextNode(""),
        premium_menu: document.createElement("div"),
    };

    /**
     * @param {MutationCallback} callback
     * @param {Node} target
     * @param {MutationObserverInit | undefined} options
     * @returns {MutationObserver}
     */
    function observer(callback, target, options) {
        const mutation = new MutationObserver(callback);
        mutation.observe(target, options || { subtree: true, childList: true });
        return mutation;
    }

    /**
     * @param {string} label
     * @returns {number}
     */
    function parseLabel(label) {
        return parseInt(label.slice(0, 4), 10);
    }

    /**
     * @returns {number}
     */
    function getPreferredQuality() {
        return currentMaxQuality > options.preferred_quality
            ? options.preferred_quality
            : currentMaxQuality;
    }

    /**
     * @typedef {object} QualityData
     * @property {any} formatId
     * @property {string} qualityLabel
     * @property {string} quality
     * @property {boolean} isPlayable
     */

    function setCurrentMaxQuality() {
        /** @type {QualityData[]} */
        const qualityData = element.player().getAvailableQualityData();
        if (qualityData.length) {
            currentMaxQuality = Math.max(
                ...qualityData.map((data) => parseLabel(data.qualityLabel))
            );
        }
    }

    /**
     * @param {QualityData[]} qualityData
     * @param {number} prefer
     * @returns {QualityData}
     */
    function getQuality(qualityData, prefer) {
        const selected = qualityData.filter((data) => {
            return parseLabel(data.qualityLabel) == prefer && data.isPlayable;
        });
        const premium = selected.findIndex((data) => {
            return data.qualityLabel.toLowerCase().includes("premium");
        });
        const isPremiumExists = premium > -1;
        return options.preferred_premium && isPremiumExists
            ? selected[premium]
            : selected[isPremiumExists ? selected.length - 1 - premium : 0];
    }

    /**
     * @typedef {object} Player
     * @property {() => string} getPlaybackQualityLabel
     * @property {() => QualityData[]} getAvailableQualityData
     * @property {Function} setPlaybackQualityRange
     */

    let isUpdated = false;

    function setVideoQuality() {
        if (manualOverride) return;
        if (isUpdated) return (isUpdated = false);
        if (!currentMaxQuality) setCurrentMaxQuality();

        /** @type {Player} */
        const player = element.player();
        const label = player.getPlaybackQualityLabel();
        const quality = parseLabel(label);
        const prefer = getPreferredQuality();
        const selected = getQuality(player.getAvailableQualityData(), prefer);

        if (
            quality &&
            listQuality.includes(quality) &&
            (isUpdated = quality != prefer || selected.qualityLabel != label)
        ) {
            player.setPlaybackQualityRange(
                selected.quality,
                selected.quality,
                selected.formatId
            );
        }
    }

    function generateSimpleId() {
        const randStr = () => Math.random().toString(36).slice(2, 3);
        return [...Array(16)].map(randStr).join("");
    }

    function triggerSyncOptions() {
        isUpdated = false;
        const id = generateSimpleId();
        GM.setValue("updated_id", id).then(() => (options.updated_id = id));
    }

    /**
     * @param {string} className
     * @param {Array} append
     * @returns {HTMLDivElement}
     */
    function itemElement(className = "", append = []) {
        const el = document.createElement("div");
        el.className = "ytp-menuitem" + (className ? "-" + className : "");
        return el.append(...append), el;
    }

    function createMenuItem(svgIcon, textLabel, checkbox = false) {
        const icon = itemElement("icon", [svgIcon]);
        const label = itemElement("label", [textLabel]);
        const inner = checkbox ? [itemElement("toggle-checkbox")] : [];
        const content = itemElement("content", inner);
        const item = itemElement("", [icon, label, content]);
        return { item, content };
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} state
     */
    function setChecked(element, state) {
        element.setAttribute("aria-checked", state);
    }

    function premiumMenu() {
        const menu = createMenuItem(icons.premium, "Preferred Premium", true);
        const optName = "preferred_premium";

        setChecked(menu.item, options[optName]);
        menu.item.addEventListener("click", function () {
            setChecked(this, saveOption(optName, !options[optName]));
            triggerSyncOptions();
            setVideoQuality();
        });

        return (element.premium_menu = menu.item);
    }

    /**
     * @param {Text} element
     * @param {string} text
     */
    function setTextQuality(element, text) {
        element.textContent = text + "p";
    }

    function qualityMenu() {
        const menu = createMenuItem(icons.quality, "Preferred Quality");
        const optName = "preferred_quality";

        menu.item.style.cursor = "default";
        Object.assign(menu.content.style, {
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "130%",
            textAlignLast: "justify",
            wordSpacing: "2rem",
        });

        setTextQuality(element.text_quality, options[optName]);
        menu.content.append("< ", element.text_quality, " >");
        menu.content.addEventListener("click", function (ev) {
            const threshold = this.clientWidth / 2;
            const offset = this.getBoundingClientRect();
            const clickPos = ev.clientX - offset.left;
            let pos = listQuality.indexOf(options[optName]);

            if (
                (clickPos < threshold && pos > 0 && pos--) ||
                (clickPos > threshold && pos < listQuality.length - 1 && ++pos)
            ) {
                const newValue = saveOption(optName, listQuality[pos]);
                setTextQuality(element.text_quality, newValue);
                triggerSyncOptions();
                setVideoQuality((manualOverride = false));
            }
        });

        return menu.item;
    }

    /**
     * @param {MouseEvent} ev
     */
    function setOverride(ev) {
        const menu = element.quality_menu();
        const quality = parseLabel(ev.target.textContent);
        if (menu && listQuality.includes(quality)) manualOverride = true;
    }

    function reset() {
        isUpdated = false;
        manualOverride = false;
        setCurrentMaxQuality();
    }

    async function syncOptions() {
        if ((await GM.getValue("updated_id")) != options.updated_id) {
            isUpdated = false;
            for (const name in options) options[name] = await GM.getValue(name);
            setChecked(element.premium_menu, options.preferred_premium);
            setTextQuality(element.text_quality, options.preferred_quality);
            const video = element.video();
            if (video && !video.paused) setVideoQuality();
        }
    }

    (function checkOptions() {
        setTimeout(() => syncOptions().then(checkOptions), 1e3);
    })();

    observer((_, observe) => {
        const video = element.video();

        if (!video) return;

        element.panel_settings().append(premiumMenu(), qualityMenu());
        element.settings().addEventListener("click", setOverride, true);
        video.addEventListener("play", () => setTimeout(setVideoQuality, 200));
        video.addEventListener("resize", setVideoQuality);
        document.addEventListener("yt-player-updated", reset);

        observe.disconnect();
    }, document.body);
})();