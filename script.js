// script.js
const fs = require('fs');
const cheerio = require('cheerio');

// 🚨🚨 التخصيص: الرجاء تغيير هذا الرقم إلى رقم الوحدة الإعلانية الفعلي الخاص بك 🚨🚨
const AD_SLOT_ID = '1234567890';
// 🚨🚨 التخصيص: إذا لم تكن متأكداً من رقم الـ Ad Client الخاص بك، فاتركه كما هو 🚨🚨
const AD_CLIENT = 'ca-pub-9228235223985409';


// 1. تعريف كود الإعلان المثبت
const AD_UNIT_HTML = `
<div id="top-fixed-ad-unit" style="position: sticky; top: 57px; z-index: 10001; width: 100%; background: #1f2937; padding: 5px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <div class="adsense-unit" style="margin: 0 auto; min-height: 50px; border: none; padding: 0;">
        <ins class="adsbygoogle"
             style="display:block; text-align:center;"
             data-ad-client="${AD_CLIENT}"
             data-ad-slot="${AD_SLOT_ID}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
</div>
`;

// 2. تعريف كود أيقونة البحث
const SEARCH_BUTTON_HTML = `
        <a href="#search-section" class="main-nav-link search-icon-btn">
            <i class="fas fa-search"></i> <span data-key="menu_search">بحث</span>
        </a>
`;

try {
    // قراءة محتوى الملف
    let html = fs.readFileSync('Index.html', 'utf8');
    const $ = cheerio.load(html);

    // 3. الإدراج الحاسم للإعلان: قبل التعليق // هذا البحث مضمون وفقاً لتحليل ملفك
    const cookieBanner = $('body').contents().filter((i, el) => el.type === 'comment' && $(el).html().includes('Cookie Banner'));
    
    if (cookieBanner.length) {
        cookieBanner.before(AD_UNIT_HTML);
        console.log("تم إدراج الإعلان المثبت بنجاح.");
    } else {
        console.log("فشل العثور على نقطة تثبيت الإعلان، تم الإدراج قبل وسم body.");
        $('body').prepend(AD_UNIT_HTML);
    }

    // 4. الإدراج الحاسم للبحث: بعد آخر رابط تنقل ("shopping-section")
    // نبحث عن الرابط الذي يحتوي على #shopping-section
    const shoppingLink = $('a[href="#shopping-section"]');
    
    if (shoppingLink.length) {
        shoppingLink.after(SEARCH_BUTTON_HTML);
        console.log("تم إدراج زر البحث بنجاح.");
    } else {
        console.log("فشل العثور على رابط التسوق. لم يتم إدراج زر البحث.");
    }
    
    // 5. إضافة وسم تحقق في نهاية الملف
    $('body').append(``);


    // كتابة المحتوى الجديد إلى الملف
    fs.writeFileSync('Index.html', $.html(), 'utf8');
    
} catch (error) {
    console.error("حدث خطأ أثناء معالجة ملف HTML:", error);
    process.exit(1);
}
