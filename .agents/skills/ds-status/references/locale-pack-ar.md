# Locale Pack — Arabic (AR)

Direction: RTL · Text Style prefix: `Text/AR/…` · **Stress copy — needs native review before product use.**
Meanings match the EN pack row for row.

| Role | Short | Medium | Long (stress) |
|---|---|---|---|
| Label / action | `حفظ` | `حفظ التغييرات` | `حفظ التغييرات وإرسالها للمراجعة` |
| Helper | `اختياري` | `يمكنك تغيير هذا لاحقًا.` | `يمكنك تغيير هذه المعلومات لاحقًا من صفحة إعدادات حسابك.` |
| Error | `مطلوب` | `هذا الحقل مطلوب.` | `هذا الحقل مطلوب. أدخل قيمة صحيحة قبل المتابعة.` |
| Placeholder | `بحث` | `أدخل النص هنا` | `ابحث بالاسم أو البريد الإلكتروني أو الرقم المرجعي` |
| Title | `تأكيد` | `تأكيد الطلب` | `أكّد طلبك قبل إرساله للموافقة` |
| Body | `راجع التفاصيل.` | `راجع التفاصيل قبل المتابعة.` | `راجع جميع التفاصيل بعناية قبل المتابعة، لأن بعض التغييرات لا يمكن التراجع عنها لاحقًا.` |
| Badge / tag | `جديد` | `قيد المراجعة` | `بانتظار الموافقة` |

## Special stress lines

| Test | String | Checks |
|---|---|---|
| Diacritics (tall marks) | `مُتَابَعَةُ الطَّلَبِ المُقَدَّمِ` | Line height, top/bottom clipping |
| Compound / long word | `والمستخدمين` · `واستخداماتهم` | Wrapping, no mid-word break |
| Mixed direction | `رقم الطلب ORD-0000-1234` | LTR run stays intact inside RTL |
| Email inside Arabic | `راسلنا على user@example.com` | LTR isolation |
| Western digits | `الخطوة 3 من 12` | Numerals policy = western |
| Arabic-Indic digits | `الخطوة ٣ من ١٢` | Numerals policy = arabic-indic |
| Punctuation | `هل أنت متأكد؟` | Arabic question mark position |

Use the digit line that matches the Profile's `numerals_AR`. If it is `open-question`, show both and raise an `OQ-*`.
