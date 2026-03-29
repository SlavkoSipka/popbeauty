# EmailJS — šablon za novu porudžbinu

1. U [EmailJS](https://www.emailjs.com/) otvori **Email Templates** → **Create new template**.
2. Poveži isti **Email Service** kao za newsletter (npr. Gmail).
3. U **Settings** šablona postavi **To Email** na adresu gde želiš da stižu porudžbine (npr. `narudzbine@tvojdomen.com`). **From Name** može biti npr. `Pop Beauty`.
4. **Subject** (predmet):

```
Nova porudžbina — {{customer_full_name}} — {{total_rsd}}
```

5. U **Content** uključi **HTML** i nalepi sadržaj ispod (zameni samo ako želiš drugačiji stil).

---

## HTML sadržaj šablona

```html
<p style="font-family:Georgia,serif;font-size:15px;color:#1C1C1A;line-height:1.6;margin:0 0 16px;">
  Nova porudžbina na sajtu <strong>{{site_name}}</strong>.
</p>

<p style="font-family:Georgia,serif;font-size:13px;color:#6B7D5E;margin:0 0 8px;">
  <strong>ID porudžbine:</strong> {{order_id}}
</p>
<p style="font-family:Georgia,serif;font-size:13px;color:#9E9B94;margin:0 0 24px;">
  {{order_date}}
</p>

<h2 style="font-family:Georgia,serif;font-size:16px;font-weight:400;color:#1C1C1A;margin:0 0 12px;border-bottom:1px solid #E8E6E1;padding-bottom:8px;">
  Kupac
</h2>
<p style="font-family:Georgia,serif;font-size:14px;color:#1C1C1A;margin:0 0 6px;">
  <strong>Ime:</strong> {{customer_full_name}}
</p>
<p style="font-family:Georgia,serif;font-size:14px;color:#1C1C1A;margin:0 0 6px;">
  <strong>Email:</strong> <a href="mailto:{{customer_email}}" style="color:#6B7D5E;">{{customer_email}}</a>
</p>
<p style="font-family:Georgia,serif;font-size:14px;color:#1C1C1A;margin:0 0 6px;">
  <strong>Telefon:</strong> {{customer_phone}}
</p>
<p style="font-family:Georgia,serif;font-size:14px;color:#1C1C1A;margin:0 0 24px;">
  <strong>Adresa za slanje:</strong><br />
  {{full_address}}
</p>

<h2 style="font-family:Georgia,serif;font-size:16px;font-weight:400;color:#1C1C1A;margin:0 0 12px;border-bottom:1px solid #E8E6E1;padding-bottom:8px;">
  Napomena
</h2>
<p style="font-family:Georgia,serif;font-size:14px;color:#3D3D38;margin:0 0 24px;white-space:pre-wrap;">{{note}}</p>

<h2 style="font-family:Georgia,serif;font-size:16px;font-weight:400;color:#1C1C1A;margin:0 0 12px;border-bottom:1px solid #E8E6E1;padding-bottom:8px;">
  Promo kod (referral)
</h2>
<p style="font-family:Georgia,serif;font-size:14px;color:#1C1C1A;margin:0 0 24px;font-family:ui-monospace,monospace;">{{referral_code}}</p>

<h2 style="font-family:Georgia,serif;font-size:16px;font-weight:400;color:#1C1C1A;margin:0 0 12px;border-bottom:1px solid #E8E6E1;padding-bottom:8px;">
  Stavke
</h2>
<div style="margin-bottom:24px;">{{{line_items_html}}}</div>

<p style="font-family:ui-monospace,monospace;font-size:12px;color:#9E9B94;margin:0 0 24px;white-space:pre-wrap;">{{line_items_text}}</p>

<h2 style="font-family:Georgia,serif;font-size:16px;font-weight:400;color:#1C1C1A;margin:0 0 12px;border-bottom:1px solid #E8E6E1;padding-bottom:8px;">
  Cena
</h2>
<p style="font-family:Georgia,serif;font-size:14px;color:#1C1C1A;margin:0 0 6px;">
  <strong>Međuzbir (pre popusta):</strong> {{subtotal_rsd}}
</p>
<p style="font-family:Georgia,serif;font-size:14px;color:#1C1C1A;margin:0 0 6px;">
  <strong>Paket / sajt popust:</strong> {{discount_line}}
</p>
<p style="font-family:Georgia,serif;font-size:14px;color:#1C1C1A;margin:0 0 6px;">
  <strong>Promo / referral:</strong> {{referral_line}}
</p>
<p style="font-family:Georgia,serif;font-size:18px;color:#1C1C1A;margin:16px 0 0;">
  <strong>Ukupno:</strong> {{total_rsd}}
</p>
```

**Napomena:** `{{{line_items_html}}}` koristi **tri zagrade** da EmailJS ne bi „escape-ovao“ HTML tabele. Ako tvoj editor ne prihvata trostruke zagrade, probaj `{{line_items_html}}` i u šablonu ostavi samo tekstualnu listu (`{{line_items_text}}`).

6. Sačuvaj šablon i kopiraj **Template ID** u `.env.local` kao `EMAILJS_ORDER_TEMPLATE_ID=...`.

---

## Varijable koje šalje aplikacija

| Ključ | Opis |
|--------|------|
| `order_id` | UUID porudžbine |
| `customer_first_name` | Ime |
| `customer_last_name` | Prezime |
| `customer_full_name` | Ime i prezime |
| `customer_email` | Email kupca |
| `customer_phone` | Telefon |
| `address_line` | Ulica |
| `city` | Grad |
| `postal_code` | Poštanski broj |
| `full_address` | Jedna linija: adresa, poštanski broj, grad |
| `note` | Napomena ili `—` |
| `referral_code` | Promo/referral kod ili `—` |
| `line_items_html` | HTML tabela stavki |
| `line_items_text` | Ista lista kao običan tekst |
| `subtotal_rsd` | Formatiran iznos (npr. `2.490,00 RSD`) |
| `discount_line` | Opis paket/sajt popusta ili `—` |
| `referral_line` | Opis referral popusta ili `—` |
| `total_rsd` | Ukupno za plaćanje |
| `order_date` | Datum i vreme (sr-RS) |
| `site_name` | `Pop Beauty` |

---

## Zašto newsletter radi, a porudžbine ne (403 „non-browser“)?

- **Newsletter** koristi `@emailjs/browser` — JavaScript se izvršava u **pregledača** posetioca. EmailJS takve zahteve tretira kao dozvoljene.
- **Porudžbine** šalju mejl sa **servera** (Next.js API ruta / Vercel). To je **ne-browser** okruženje. U EmailJS mora biti posebno **uključeno** slanje API-jem iz takvog okruženja.

Bez toga dobijaš **403** i poruku tipa *„API access from non-browser environments is currently disabled“* — to **nije** greška u kodu sajta, nego podešavanje naloga na [dashboard.emailjs.com → Account → Security](https://dashboard.emailjs.com/admin/account/security).

---

## Ako obaveštenje o porudžbini ne stiže na mejl

1. **EmailJS → Account → Security** — uključi opciju da su **API pozivi dozvoljeni van pregledača** (non-browser / server). Bez ovoga zahtevi sa Vercel/servera često vraćaju grešku i mejl ne ide. Ovo je najčešći uzrok.

2. **`EMAILJS_PRIVATE_KEY`** — **Account** → **API keys** → **Private Key**. Dodaj u `.env` lokalno i u **Vercel Environment Variables** (Redeploy posle izmene). Aplikacija koristi zvanični `@emailjs/nodejs` SDK koji šalje ovaj ključ kao `accessToken`.

3. **Proveri ostale env varijable na hostingu:** `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, **`EMAILJS_ORDER_TEMPLATE_ID`** (ili `NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID` ako server-only varijabla ne postoji na hostingu).

4. U EmailJS šablonu proveri **To Email** (primalac) i da je šablon sačuvan.

5. Logovi servera: greške počinju sa `[emailjs-order] EmailJS` — tu je status (npr. 403) i tekst od EmailJS-a.

6. **Spam** — proveri neželjeno; za Gmail kao servis u EmailJS ponekad treba App password za nalog.
