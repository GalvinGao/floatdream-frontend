/*! ie-alert-warning */
/**
 * 「旧版IE淘汰行动」之「旧版IE升级提示弹窗代码」
 *  https://support.dmeng.net/ie-alert-warning.html
 */

var _iealwn = _iealwn || [];
if (! _iealwn.outver || _iealwn.outver > 10) {
  _iealwn.outver = 10;
}

// 国产双核浏览器
_iealwn.browserNames = {
  'QQBrowser' : 'QQ浏览器',
  '360SE' : '360安全浏览器',
  '2345Explorer' : '2345加速浏览器',
  'Baidu' : '百度浏览器',
  'LBBROWSER' : '猎豹安全浏览器',
  'Maxthon' : '傲游浏览器',
  'Sogou' : '搜狗浏览器',
  'UC' : 'UC浏览器'
};

// 示意图高度
_iealwn.imgHeight = {
  'QQBrowser' : 172,
  '360SE' : 176,
  '2345Explorer' : 243,
  'Baidu' : 172,
  'LBBROWSER' : 220,
  'Maxthon' : 400,
  'Sogou' : 119,
  'UC' : 126
};

_iealwn.browser = function() {
  var u = navigator.userAgent;
  var browser = 'IE';

  if (u.indexOf('QQBrowser') > -1) {
    browser = 'QQBrowser';

  } else if (u.indexOf('2345Explorer') > -1) {
    browser = '2345Explorer';

  } else if (u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1) {
    browser = 'Sogou';

  } else if (u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1) {
    browser = 'Baidu';

  } else if (u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1) {
    browser = 'UC';

  } else if (u.indexOf('LBBROWSER') > -1 || (!! window.external && !! window.external.LiebaoAutoFill_CopyToClipboard)) {
    browser = 'LBBROWSER';

  } else if (u.indexOf('Maxthon') > -1 || (!! window._MX$MF_6a39a14b_c884_4333_a26b_08330f10ab4aMxBIG)) {
    browser = 'Maxthon';

  } else if (u.indexOf('360SE') > -1) {
    browser = '360SE';

  } else {

    // IE9、10
    if (!! u.match(/MSIE (9|10)/g)) {
      // 根据窗口标题栏、网址栏、收藏栏高度判断
      var navigator_top = window.screenTop - window.screenY;
      switch(navigator_top){
        case 71:
        case 100:
        case 102:
        case 126:
          browser = '2345Explorer';
          break;
        case 75:
        case 74:
        case 105:
        case 104:
          browser = '360SE';
          break;
      }
    }
  }

  return browser;
};

_iealwn.close = function() {
  var el = document.getElementById("_iealwn_div");
  el.outerHTML = "";
  delete el;

  if (!! _iealwn.once) {
    var d = new Date();
    d = new Date(d.getTime() + 1000*60* _iealwn.once );
    document.cookie = '_iealwn=once; expires=' + d.toGMTString() + '; path=/';
  }
};

_iealwn.load = function() {

  var css = '#iealertwn{text-align:center;display:block!important;z-index:99999;height:100%;width:100%;background:#000;}\
    #iealertwn .iealwn-wrap{position:absolute;z-index:2147483647;top:25px;left:0;right:0}\
    #iealertwn .iealwn-box{width:800px;margin:0 auto 20px;overflow:hidden;border:1px solid #ededed}\
    #iealertwn .iealwn-main{border:10px solid #fff;font-family:"宋体"}\
    #iealertwn .iealwn-line{height:32px;line-height:32px;background-color:#ffeeba;color:#c4691f;text-align:center;font-size:12px}\
    #iealertwn .iealwn-line a{color:#c4691f;text-decoration:none}\
    #iealertwn .iealwn-notice{background-color:#fff8e5;padding:50px 55px 55px;text-align:left;color:#c4691f;font-size:16px}\
    #iealertwn .iealwn-title{display:block;background-repeat:no-repeat;line-height:22px;height:22px;margin:50px 0 10px 0;font-weight:700}\
    #iealertwn .iealwn-title_alert{margin:0 0 24px;padding:0;font-size:24px;line-height:28px;height:28px;color:#da2128}\
    #iealertwn .iealwn-title_horn{background-image:url('+_iealwn.dir+'/images/icon_horn.png)}\
    #iealertwn .iealwn-title_browser{background-image:url('+_iealwn.dir+'/images/icon_browser.png)}\
    #iealertwn .iealwn-title_faq{background-image:url('+_iealwn.dir+'/images/icon_faq.png)}\
    #iealertwn .iealwn-text{position:relative;margin:10px 2px;line-height:24px}\
    #iealertwn .iealwn-text-muted, #iealertwn .iealwn-text-muted a{color:#999}\
    #iealertwn a{color:#da2128;text-decoration:underline}\
    #iealwn-browsers .iealwn-browser-link{text-decoration:none;display:inline-block;width:90px;color:#c4691f}\
    #iealwn-browsers .iealwn-browser-dlink{text-decoration:none;background-color:#ffeeba;color:#c4691f;display:inline-block;width:60px;text-align:center}\
    #iealwn-browsers .iealwn-browser-dlink:hover{background-color:#dc3545;color:#fff}\
    #iealwn-browsers .iealwn-browser-clear{clear:left;width:100%;height:1px;content:""}\
    #iealwn-browsers .iealwn-browser{background-color:#fff;background-repeat:no-repeat;background-position:8px 5px;line-height:44px;padding-left:50px;float:left;margin:18px 18px 0 0;font-size:14px;}\
    #iealwn-browsers .iealwn-browser-mr0{margin-right:0}\
    img.iealwn-guide{background:url('+_iealwn.dir+'/images/blank.png) no-repeat center center #e9ecef}';

  var style = document.createElement('style');
  style.id = '_iealwn_style';
  style.type = 'text/css';

  if (style.styleSheet)
    style.styleSheet.cssText = css;
  else
    style.innerHTML = css;

  document.getElementsByTagName('head')[0].appendChild(style);

  var browsers = [
    {
      'slug' : 'chrome', 'name' : '谷歌 Chrome',
      'url' : 'https://www.google.cn/chrome/',
      'durl' : 'https://www.google.cn/chrome/'
    }, {
      'slug' : 'firefox', 'name' : '火狐 FireFox',
      'url' : 'https://www.mozilla.org/zh-CN/firefox/new/',
      'durl' : 'https://www.mozilla.org/zh-CN/firefox/new/'
    }, {
      'slug' : 'edge', 'name' : '微软 Edge',
      'url' : 'https://www.microsoft.com/zh-cn/windows/microsoft-edge',
      'durl' : 'https://www.microsoft.com/zh-cn/windows/microsoft-edge'
    }
  ];

  var isXP = navigator.userAgent.indexOf("Windows NT 5") != -1;
  var is7or8 = navigator.userAgent.indexOf("Windows NT 6") != -1;
  var browsersHtml = '';
  for (var i=0; i<browsers.length; i++) {

    var slug = browsers[i]['slug'];

    var classes = 'iealwn-browser iealwn-browser_' + slug;
    if ( (i+1) % 3 == 0) classes += ' iealwn-browser-mr0';

    if ( isXP && slug.match(/(chrome|firefox|edge)/g) ) {
      var warningTitle = browsers[i]['name'] + '已经全面停止支持 Windows XP 系统！请选择其他浏览器。';
      if (slug == 'edge')
        warningTitle = 'Microsoft Edge 专为 Windows 10 打造！请选择其他浏览器。';

      browsersHtml +=
        '<div class="' + classes + '" style="background-image:url('+_iealwn.dir+'/images/'+slug+'_gray.png)">\
                    <a href="#" onclick="alert(\''+warningTitle+'\');return false;" class="iealwn-browser-link" style="color:#777">' + browsers[i]['name'] + '</a>\
                    <a href="#" onclick="alert(\''+warningTitle+'\');return false;" class="iealwn-browser-dlink" style="color:#777;background:#ccc">不支持</a>\
                </div>';

    } else if (is7or8 && slug == 'edge') {
      browsersHtml +=
        '<div class="' + classes + '" style="background-image:url('+_iealwn.dir+'/images/'+slug+'_gray.png)">\
                    <a href="#" onclick="alert(\'Microsoft Edge 专为 Windows 10 打造！请选择页面所列出的其他浏览器或点击右侧按钮下载 IE 11。\');return false;" class="iealwn-browser-link" style="color:#777">' + browsers[i]['name'] + '</a>\
                    <a href="https://www.microsoft.com/zh-cn/download/internet-explorer-11-for-windows-7-details.aspx" class="iealwn-browser-dlink" target="_blank" title="下载' + browsers[i]['name'] + '">IE11</a>\
                </div>';

    } else {
      browsersHtml +=
        '<div class="' + classes + '" style="background-image:url('+_iealwn.dir+'/images/'+slug+'.png)">\
                    <a href="' + browsers[i]['url'] + '" class="iealwn-browser-link" target="_blank">' + browsers[i]['name'] + '</a>\
                    <a href="' +  browsers[i]['durl'] + '" class="iealwn-browser-dlink" target="_blank" title="点击下载' + browsers[i]['name'] + '">下载</a>\
                </div>';
    }

  }

  var currentBrowserHtml = '';
  currentBrowserHtml += '<div class="iealwn-text iealwn-text-muted">难道您使用的不是IE浏览器？是 ';
  var i = 1;
  var count = 0;
  for(var prop in _iealwn.browserNames){
    count++;
  }
  for (var browser in _iealwn.browserNames) {
    currentBrowserHtml += '<a href="javascript:;" onclick="_iealwn.browserAlert(\''+browser+'\')">'+_iealwn.browserNames[browser]+'</a>';
    if (i < count) {
      currentBrowserHtml += '、';
    }
    i++;
  }
  currentBrowserHtml += ' 其中的一个吗？若是如此，您暂可不必升级；请点击名称查看教程并按步骤<strong>切换至极速内核</strong>即可正常访问。</div>';

  var alertHtml =
    '<div id="iealertwn"><div class="iealwn-wrap"><div class="iealwn-box"><div class="iealwn-main">\
        <div class="iealwn-line">\
            旧版 Internet Explorer 升级提示\
        </div>\
        <div class="iealwn-notice">\
            <div class="iealwn-title iealwn-title_alert">危险！您正在使用的IE' + (_iealwn.iever ? _iealwn.iever : '') + '浏览器已过期，请立即升级！</div>\
            <div class="iealwn-text">自2016年1月12日起，微软不再为IE11以下版本提供相应支持和更新。没有关键的浏览器安全更新，您的电脑很可能受有害病毒、间谍软件和其他恶意软件的攻击，它们可以窃取或损害您的业务数据和信息。为确保您的电脑安全，请立即停止使用IE的过期版本！</div>\
            <div class="iealwn-browser_alert" id="_iealwn_browserAlert">\
                <div class="iealwn-title iealwn-title_horn"><span style="margin-right:8px">■</span> 是时候升级你的浏览器了！</div>\
                <div class="iealwn-text">如您坚持使用当前浏览器访问本站，你将看到排版错误、功能不全、无法正常使用的网页，甚至是满屏乱码。请至少升级至 IE' + (_iealwn.outver+1) + ' 或使用更先进的浏览器再访问。</div>\
            </div>\
            <div class="iealwn-browseralert_new" id="_iealwn_browserAlert_new">' + currentBrowserHtml + '</div>\
            <div class="iealwn-title iealwn-title_browser"><span style="margin-right:8px">■</span> 下载更先进的浏览器</div>\
            <div class="iealwn-browsers" id="iealwn-browsers">'+
    browsersHtml +
    '<div class="iealwn-browser-clear"></div>\
</div>\
<div class="iealwn-title iealwn-title_faq"><span style="margin-right:8px">■</span> 为什么会出现这个弹窗？</div>\
<div class="iealwn-text">如果你不知道升级浏览器是什么意思，请请教一些熟练电脑操作的朋友，让他们帮你完成浏览器升级</div>\
</div>\
<div class="iealwn-line">\
<a href="javascript:;" onclick="_iealwn.close()">我已了解低版本IE浏览器所可能带来的巨大风险，且同意并理解一梦千年将不对因使用了低版本IE浏览器负任何相关连带责任；关闭弹窗</a>\
</div>\
</div></div></div></div>';

  var alertDiv = document.createElement('div');
  alertDiv.id = '_iealwn_div';
  alertDiv.innerHTML = alertHtml;
  document.getElementsByTagName('body')[0].appendChild(alertDiv);

  // 延迟判断，因为傲游浏览器的属性是异步注入
  setTimeout(function(){
    _iealwn.browserAlert();
  }, 1000);

};

_iealwn.fixload = function(num) {
  if (
    document.getElementById('_iealwn_div') === null
    && document.getElementsByTagName('head').length > 0
    && document.getElementsByTagName('body').length > 0
  ) {
    _iealwn.load();
  } else {
    if (num > 1) {
      setTimeout(function(){
        _iealwn.fixload(num - 1);
      }, 1000);
    }
  }
};

_iealwn.browserAlert = function(browser) {

  if (! browser) {
    browser = _iealwn.browser();
  }
  var names = _iealwn.browserNames;
  var alertHtml = '';

  if (!! names[browser]) {

    var browserName = names[browser];
    var imgHeight = _iealwn.imgHeight[browser];

    alertHtml +=
      '<div class="iealwn-title iealwn-title_horn"><span style="margin-right:8px">■</span> 您使用的是' + browserName + '吗？</div>\
            <div class="iealwn-text">您正在使用的可能是' + browserName + 'IE兼容模式。若是如此，您暂可不必升级，按下图所示步骤切换至极速内核也可正常访问。（示意图仅供参考，浏览器不同版本可能有差异）</div>\
            <div class="iealwn-text"><img class="iealwn-guide" src="' + _iealwn.dir + '/images/switch-'+browser+'.png" width="586" height="'+imgHeight+'" style="width:586px !important;height:'+imgHeight+'px !important" alt="示意图" title="如图片未显示，请点击右键选择 显示图片(H)"></div>\
        ';

    alertHtml += '<div class="iealwn-text iealwn-text-muted">其他双核浏览器切换极速内核示意图（点击名称查看）：';
    for (var key in names) {
      if (key == browser) continue;
      alertHtml += '<a href="javascript:;" onclick="_iealwn.browserAlert(\''+key+'\')">'+names[key]+'</a> &nbsp;';
    }
    alertHtml += '</div>';

    document.getElementById('_iealwn_browserAlert').style.display = 'none';
    document.getElementById('_iealwn_browserAlert_new').innerHTML = alertHtml;
  }

};

var _jsver = 0;
/*@cc_on
    _jsver = @_jscript_version;
@*/

if (_jsver == 0) {
  // IE11 或者不是 IE

} else {

  var docmode = document.documentMode;

  if (!! docmode && docmode > 5) {
    _iealwn.iever = docmode;
  } else if (_jsver == 5.7 && window.XMLHttpRequest) {
    _iealwn.iever = 7;
  } else if (_jsver == 5.6 || (_jsver == 5.7 && !window.XMLHttpRequest)) {
    _iealwn.iever = 6;
  } else {
    _iealwn.iever = 5;
  }

  if (_iealwn.iever <= _iealwn.outver) {
    _iealwn.show = true;
    if (!! _iealwn.once) {
      var cke = document.cookie.match(new RegExp('_iealwn=([^;]+)'));
      if (cke && cke[1] == "once"){
        _iealwn.show = false;
      }
    }
    if (_iealwn.show) {
      var s = document.getElementById('_iealwn_js');
      if (! _iealwn.dir) {
        // var path = s.src.split('?')[0];
        // _iealwn.dir = path.split('/').slice(0, -1).join('/');
        /*cdn*/_iealwn.dir = "https://netcdn.dmeng.net";
      }

      if (window.addEventListener) {
        window.addEventListener('load', _iealwn.load, false);
      } else if (window.attachEvent) {
        window.attachEvent('onload', _iealwn.load);
      }

      // fixed some sites event load error
      setTimeout(function(){
        _iealwn.fixload(5);
      }, 1500);
    }
  }
}