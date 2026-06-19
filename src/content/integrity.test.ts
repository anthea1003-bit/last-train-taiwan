import { describe, it, expect } from 'vitest';
import { REGIONS } from './regions';
import { LOCALES } from './locales';

describe('Content Integrity - Localization Keys Verification', () => {
  const languages = ['zh-TW', 'en'] as const;

  it('should verify all referenced keys exist in both languages', () => {
    REGIONS.forEach(region => {
      // 1. Verify region nameId
      languages.forEach(lang => {
        expect(LOCALES[lang], `Language "${lang}" is missing region name key: "${region.nameId}"`)
          .toHaveProperty(region.nameId);
      });

      region.events.forEach(event => {
        // 2. Verify event textId
        languages.forEach(lang => {
          expect(LOCALES[lang], `Language "${lang}" is missing event desc key: "${event.textId}"`)
            .toHaveProperty(event.textId);
        });

        const chall = event.challenge;
        // 3. Verify challenge textId and hintTextId
        languages.forEach(lang => {
          expect(LOCALES[lang], `Language "${lang}" is missing challenge desc key: "${chall.textId}"`)
            .toHaveProperty(chall.textId);
          expect(LOCALES[lang], `Language "${lang}" is missing hint key: "${chall.hintTextId}"`)
            .toHaveProperty(chall.hintTextId);
        });

        // 4. Verify choices textId and consequenceTextId
        chall.choices.forEach(choice => {
          languages.forEach(lang => {
            expect(LOCALES[lang], `Language "${lang}" is missing choice text key: "${choice.textId}"`)
              .toHaveProperty(choice.textId);
            expect(LOCALES[lang], `Language "${lang}" is missing consequence key: "${choice.consequenceTextId}"`)
              .toHaveProperty(choice.consequenceTextId);
          });
        });
      });
    });
  });
});
