# Bilingual Guide: Arabic Typography & RTL Design Systems

دليل تصميم الأنظمة ثنائية اللغة: الطباعة العربية واتجاه الواجهة (RTL)

---

## 1. The Core Rule: Language != Direction

In a world-class design system, **Language** and **Direction** are treated as independent dimensions:
- An interface can be in English with LTR layout.
- An interface can be in Arabic with RTL layout.
- Mixed content (e.g., Arabic text containing an English SKU or phone number) must preserve correct visual order.

---

## 2. Arabic Typography Constraints (الخطوط والطباعة العربية)

Arabic script has distinct vertical metrics compared to Latin:
1. **Line Height (ارتفاع السطر)**:
   - **Rule**: Arabic text must have a line height $\ge 1.4\times$ the font size (preferably $1.5\times$ to $1.6\times$).
   - **Reason**: Arabic characters feature tall ascenders (أ, ل) and deep descenders (ي, ر, ح). Standard Latin line-heights (1.2x) will visibly clip diacritics (تَشْكِيل) or ligatures.
2. **Letter Spacing (تباعد الحروف)**:
   - **Rule**: Letter spacing for Arabic MUST be `0px` (`0%`).
   - **Reason**: Arabic is a cursive, connected script. Adding tracking breaks the connections between glyphs, which is an orthographic error.
3. **Recommended Pairings (الخطوط الموصى بها)**:

| Style / Use Case | Latin Font | Arabic Font | Personality |
|---|---|---|---|
| **Modern Corporate & SaaS** | *Inter* | *IBM Plex Sans Arabic* | Neutral, highly legible, technical precision |
| **Consumer & Clean Tech** | *Plus Jakarta Sans* | *Readex Pro* | Geometric, open counters, modern aesthetic |
| **Bold & Marketing Focused** | *Poppins* | *Cairo* | Expressive, bold headlines, geometric |
| **Editorial & Public Sector** | *Noto Sans* | *Noto Sans Arabic* | Comprehensive Unicode coverage, universal |

---

## 3. Direction & RTL in Figma Auto Layout (إدارة الاتجاه في فيجما)

Figma Auto Layout does not natively reverse element order when switching language. To solve this without duplicating entire component sets:

### The Direction Helper Pattern (`_DirectionHelper`)
1. Create a private sub-component `_DirectionHelper` with two variants:
   - `Direction = LTR`: Horizontal layout, primary item on Left, trailing item on Right.
   - `Direction = RTL`: Horizontal layout, primary item on Right, trailing item on Left.
2. Expose the `Direction` property on the parent component (e.g., `Button / Web`).
3. Icons that indicate direction (Arrows, Chevrons, Back/Forward buttons) must flip in RTL mode. Icons representing universal objects (Search magnifying glass, Heart, Camera, Settings gear) must **never** flip.

---

## 4. Bilingual Prompt Snippets (نماذج للتواصل باللغتين)

### Asking for Brand & Colors / استفسار عن الهوية والألوان:
> **EN**: "What is your primary brand color hex code, and do you have a preference for secondary semantic colors (success, warning, error)?"  
> **AR**: "ما هو كود اللون الأساسي لهوية علامتك التجارية (Hex Code)؟ وهل لديك تفضيل لألوان الحالات التفاعلية (النجاح، التحذير، الخطأ)؟"

### Asking for Typography Pairings / استفسار عن الخطوط:
> **EN**: "Which font pairing would you like to use? We recommend *Inter* for Latin and *IBM Plex Sans Arabic* for Arabic to maintain perfect line heights."  
> **AR**: "ما هو ثنائي الخطوط المفضل لديك؟ نوصي باستخدام *Inter* للإنجليزية و *IBM Plex Sans Arabic* للعربية لضمان تناسق ارتفاع الأسطر وعدم قص الحروف."

### Presenting Approval Gates / طلب الموافقة على العقد أو التوليد:
> **EN**: "The Component Contract `CC-BUTTON-WEB-001 v1.0` is ready for review. To proceed with the build, confirm with: `Approve CC-BUTTON-WEB-001 v1.0 Ready to Build`."  
> **AR**: "تم تجهيز عقد المكون `CC-BUTTON-WEB-001 v1.0` للمراجعة. لبدء البناء في فيجما، يُرجى تأكيد الموافقة عبر إرسال: `Approve CC-BUTTON-WEB-001 v1.0 Ready to Build`."
