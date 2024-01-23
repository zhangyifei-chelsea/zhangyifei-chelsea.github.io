$(function() {
  var $jsInputPostalCode = $('.js-input-postal-code');
  var inputPostalCodeFirstThreeDigits = '';
  var fetchData = '';

  $jsInputPostalCode.on('input', function(e) {
    var inputPostalCode = $jsInputPostalCode.val();

    // 数値三桁が入力されたらデータを取ってくる
    if (/^[0-9０-９]{3}$/.test(inputPostalCode)) {
      // 全角を半角に修正
      inputPostalCode = convertToSingleByte(inputPostalCode);
      // すでに取得しているデータならデータ取得しない
      if (inputPostalCodeFirstThreeDigits === inputPostalCode.substr(0, 3)) {
        return;
      }

      inputPostalCodeFirstThreeDigits = inputPostalCode.substr(0, 3);
      var url = $('#baseJS').data('postal-code-url') + inputPostalCodeFirstThreeDigits + ".json";
      $.ajax({
        type: "get",
        dataType: "json",
        url: url,
        success: function(json) {
          // 取得したJSONデータを保持
          fetchData = json;
        }
      });
    }

    // 郵便番号のフォーマットであればデータの中から住所を探す
    if (isPostalCode(inputPostalCode)) {
      // ハイフンを取り除く
      inputPostalCode = inputPostalCode.replace(/[\-−ー]/g, '');
      // 全角を半角に修正
      inputPostalCode = convertToSingleByte(inputPostalCode);

      if (fetchData[inputPostalCode]) {
        setAddressDataToForm(fetchData[inputPostalCode]);
      } else {
        // undefinedだった場合は再取得を試みたあとにフォームにセットする
        inputPostalCodeFirstThreeDigits = inputPostalCode.substr(0, 3);
        var url = $('#baseJS').data('postal-code-url') + inputPostalCodeFirstThreeDigits + ".json";
        $.ajax({
          type: "get",
          dataType: "json",
          url: url,
          success: function(json) {
            if (json[inputPostalCode]) {
              setAddressDataToForm(json[inputPostalCode]);
            }
          }
        });
      }
    }
  });
});

function isPostalCode(postalCode) {
  return postalCode.match(/^[0-9０-９]{3}[\-−ー]?[0-9０-９]{4}$/);
}

function convertToSingleByte(postalCode) {
  return postalCode.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 65248);
  });
}

function setAddressDataToForm(data) {
  $('.js-input-prefecture').val(data[0]);
  $('.js-input-address1').val(data[1] + data[2]);
  $('.js-input-address1').trigger('focus');
}

$(function() {
    $('.js-ec-cart-on-change-quantity').on('change', function() {
        $(this).closest('form').submit();
    });
});

$(function() {
    var key = 'ecRecentlyViewedProducts';
    var read = function(key) {
        try {
            var item = JSON.parse(window.localStorage.getItem(key)) || [];
            return Array.isArray(item) ? item : [];
        } catch (e) {
            return [];
        }
    };
    var write = function(key, value) {
        var uniq = Array.from(new Set(value)).slice(0, 100);
        if (uniq.length > 0) {
            window.localStorage.setItem(key, JSON.stringify(uniq));
        }
    };

    if ($('.js-ec-recently-viewed-products').length > 0) {
        var params = read(key).join(',');
        if (params.length > 0) {
            $.get('/ec/products/recently-viewed-products', {
                id: params
            }).done(function(data) {
                if (data && data.length > 0) {
                    $('.js-ec-recently-viewed-products').html(data);
                }
            });
        }
    }

    if ($('.js-ec-write-viewed-product').length > 0) {
        var productIds = read(key);
        productIds.unshift($('.js-ec-write-viewed-product').data('product-id'));
        write(key, productIds);
    }
});

// 国内・国外在住
(() => {
    const inputInForeignCountries = document.querySelectorAll('.js-input-in-foreign-country');
    if (inputInForeignCountries.length == 0) {
        return;
    }

    const addressClasses = ['.js-input-postal-code', '.js-input-prefecture', '.js-input-address1', '.js-input-address2'];

    // 国外選択の注意文
    const div = document.createElement('div');
    div.classList.add('text-danger', 'js-in-foreign-country-note');
    div.style.display = 'none';
    div.innerText = inputInForeignCountries[0].parentNode.parentNode.parentNode.dataset.note;
    inputInForeignCountries[0].parentNode.parentNode.parentNode.after(div);

    // 必須マーク
    if (inputInForeignCountries[0].parentNode.parentNode.parentNode.dataset.addressRequired == '1') {
        const createRequiredMark = () => {
            const i = document.createElement('i');
            i.classList.add('fa', 'fa-asterisk', 'text-danger', 'position-absolute', 'pl-1');
            return i;
        };
        addressClasses.forEach((c) => {
            document.querySelector(c).parentNode.parentNode.querySelector('label').append(createRequiredMark());
        });
    }

    // 国内・国外選択の制御
    const inForeignCountryHandle = () => {
        const checked = document.querySelector('.js-input-in-foreign-country:checked');
        if (!checked) {
          return;
        }
        const inForeignCountry = document.querySelector('.js-input-in-foreign-country:checked').value == '1';
        addressClasses.forEach((c) => {
            document.querySelector(c).parentNode.parentNode.style.display = inForeignCountry ? 'none' : '';
        });
        document.querySelector('.js-in-foreign-country-note').style.display = inForeignCountry ? '' : 'none';
    };
    inForeignCountryHandle();
    inputInForeignCountries.forEach((e) => e.addEventListener('change', inForeignCountryHandle));
})();
