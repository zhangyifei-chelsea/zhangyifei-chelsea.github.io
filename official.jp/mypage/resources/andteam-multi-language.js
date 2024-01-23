(() => {
    // 画面展開時
    window.addEventListener('DOMContentLoaded', (event) => {
        const lang = getCookie() ?? 'jpn';
        const select = document.querySelector('.js-multi-language');
        const option = select.querySelector(`option[value="${lang}"]`);
        if (option) {
            option.selected = true;
        }
        // コンボボックスが変更されたときに表示切替とCookie保存を行う
        select.addEventListener('change', (event) => {
            onChange();
            saveCookie(event.target.value);
        })
        // 表示切替を行う
        onChange();
    });

    // 表示切替
    const onChange = () => {
        document.querySelectorAll('.js-multi-language option').forEach((option) => {
            document.querySelectorAll(`[class="${option.value}_contents"`).forEach((element) => {
                element.style.display = option.selected ? 'block' : 'none';
            });
        });
        const selected = document.querySelector('.js-multi-language').value;
        if (window.location.pathname.match(/^\/posts\/news/) && !window.location.pathname.match(/^\/posts\/news.*\//)) {
            const newsPath = '/posts/' + ({ 'jpn': 'news', 'kor': 'newskr', 'chn': 'newscn', 'eng': 'newsen' })[selected];
            if (window.location.pathname != newsPath) {
                window.location = newsPath + window.location.search;
            }
        }
        if (window.location.pathname.match(/^\/posts\/schedule/) && !window.location.pathname.match(/^\/posts\/schedule.*\//)) {
            const schedulePath = '/posts/' + ({ 'jpn': 'schedule', 'kor': 'schedulekr', 'chn': 'schedulecn', 'eng': 'scheduleen' })[selected];
            if (window.location.pathname != schedulePath) {
                window.location = schedulePath + window.location.search;
            }
        }
    }

    // Cookieの取得
    const getCookie = () => {
        const cookies = document.cookie.split('; ');
        for (let c of cookies) {
            const cookie = c.split('=');
            if (cookie[0] == 'pf_lang') {
                return cookie[1];
            }
        }
    }

    // Cookieの保存
    const saveCookie = (value) => {
        // 現在日時から90日後を設定
        document.cookie = [
            'pf_lang=' + value,
            'max-age=' + (90 * 24 * 60 * 60),
            'path=/',
            'secure'
        ].join('; ');
    }
})();