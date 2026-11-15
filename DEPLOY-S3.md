# Deploying to Amazon S3 (shrimithra.in)

The site is a static export. `npm run build` creates the `out/` folder; **upload the contents of `out/`, not the source code.**

## 1. Before each build

Edit `.env.production`:

```
NEXT_PUBLIC_SITE_URL=https://shrimithra.in
NEXT_PUBLIC_CONTACT_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

- Create the form at https://formspree.io (free plan works), copy its endpoint URL into `NEXT_PUBLIC_CONTACT_ENDPOINT`.
- In Formspree, under the form's settings, restrict submissions to the domain `shrimithra.in`.
- Until the endpoint is set, the contact form shows "Our contact form is being set up".

Then build:

```bash
npm install
npm run build
```

The build also runs `scripts/flatten-segments.mjs`, which adds the page-prefetch files that static hosts need.

## 2. Create the S3 bucket (one time)

1. S3 → Create bucket → name: `shrimithra.in`, region of your choice.
2. Properties → **Static website hosting** → Enable.
   - Index document: `index.html`
   - Error document: `404.html`
3. Permissions → turn off "Block all public access" for this bucket, then add this bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForWebsite",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::shrimithra.in/*"
    }
  ]
}
```

Static website hosting is what makes `/services/web-development/` open its `index.html`; keep it enabled.

## 3. Upload `out/`

With the AWS CLI configured (`aws configure`), from the `website` folder:

```bash
# hashed assets: cache for a year
aws s3 sync out/_next/static s3://shrimithra.in/_next/static --delete --cache-control "public,max-age=31536000,immutable"
```

```bash
# everything else (HTML, prefetch data, images): always revalidate
aws s3 sync out s3://shrimithra.in --delete --exclude "_next/static/*" --cache-control "public,max-age=0,must-revalidate"
```

Or upload the contents of `out/` through the S3 console (drag the files and folders inside `out/`, not the folder itself).

## 4. HTTPS and the domain (recommended: CloudFront)

The S3 website endpoint is HTTP only. Google expects HTTPS, and the build uses `https://shrimithra.in`, so put CloudFront in front:

1. **ACM** (region **us-east-1**): request a certificate for `shrimithra.in` and `www.shrimithra.in`, validate by DNS.
2. **CloudFront** → Create distribution:
   - Origin: the bucket's **website endpoint** (e.g. `shrimithra.in.s3-website.ap-south-1.amazonaws.com`), protocol HTTP only.
     Use the website endpoint, not the REST endpoint, so folder URLs and the 404 page work.
   - Viewer protocol policy: Redirect HTTP to HTTPS. Compression: on.
   - Alternate domain names: `shrimithra.in`, `www.shrimithra.in`; certificate: the ACM one.
3. **DNS** (Route 53 or your registrar): point `shrimithra.in` (A/ALIAS) and `www` to the CloudFront distribution.
4. After every upload, clear the CDN cache:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 5. After going live

- Open https://shrimithra.in and a service page, and send a test enquiry through the contact form.
- Google Search Console: add `shrimithra.in`, submit `https://shrimithra.in/sitemap.xml`.
