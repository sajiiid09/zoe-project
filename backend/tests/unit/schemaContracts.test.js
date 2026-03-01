import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('the Prisma schema defines the new supplier and affiliate contracts', () => {
  const schema = fs.readFileSync(new URL('../../prisma/schema.prisma', import.meta.url), 'utf8');

  const requiredSnippets = [
    'AFFILIATE',
    'model AffiliateProfile',
    'model VendorSubmission',
    'model CatalogProduct',
    'model VendorSupplyAgreement',
    'model AffiliateLink',
    'model AffiliateClick',
    'model AffiliateCommission',
    'model VendorPayout',
    'model AffiliatePayout',
    'enum SubmissionStatus',
    'enum CatalogStatus',
    'enum PayoutStatus',
    'enum CommissionStatus',
    'affiliateFeePaid',
  ];

  for (const snippet of requiredSnippets) {
    assert.match(schema, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
