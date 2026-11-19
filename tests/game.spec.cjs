const {test, expect} = require('@playwright/test');
for (const edition of ['demo', 'complete']) {
 test.describe(edition, () => {
  test('loads desk, opens document, reveals hidden writing and keeps controls minimal', async ({page}) => {
   const errors = [];
   page.on('pageerror', e => errors.push(e.message));
   await page.goto('/' + edition + '/');
   await expect(page.locator('#papers .paper')).toHaveCount(6, {timeout:15000});
   await expect(page.locator('#chapterTitle')).not.toBeEmpty();
   // Opening intro is optional on resumed sessions.
   if (await page.locator('#introOverlay').isVisible()) await page.locator('#startCase').click();
   await page.locator('#papers .paper').nth(1).click({force:true});
   await expect(page.locator('#reader')).toBeVisible();
   await expect(page.locator('.investigationActions button')).toHaveCount(3);
   await page.locator('#flip').click();
   await page.locator('#backlight').click();
   await expect(page.locator('#transmittedInk')).toBeVisible();
   await expect(page.locator('#transmittedText')).toContainText('21:17');
   await page.locator('#transmittedInk').hover({position:{x:45,y:65}});
   await page.locator('#transmittedInk').hover({position:{x:140,y:95}});
   await page.locator('#transmittedInk').hover({position:{x:270,y:125}});
   await expect(page.locator('#transmittedInk')).toHaveClass(/inspected/);
   await expect(page.locator('#v02Tour')).toBeHidden();
   expect(errors, 'Uncaught browser errors').toEqual([]);
  });
  test('B2 code requires both transmitted-light discoveries', async ({page}) => {
   await page.goto('/' + edition + '/');
   if (await page.locator('#introOverlay').isVisible()) await page.locator('#startCase').click();
   await page.evaluate(() => {state.chapter=0;state.puzzles[0]=false;state.discoveries={};state.seen[0]=[0,1,2,3,4,5];save();render()});
   await page.locator('#puzzleButton').evaluate(el=>el.click());
   await expect(page.locator('#puzzleResult')).toContainText('просвет');
   await page.locator('#puzzle').evaluate(el=>el.hidden=true);
   for(const index of [1,5]){
    await page.evaluate(i=>openDoc(i),index);
    await page.locator('#flip').click();
    await page.locator('#backlight').click();
    await expect(page.locator('#transmittedInk')).toBeVisible();
    await page.locator('#transmittedInk .scanAccess').evaluate(el=>el.click());
    await expect(page.locator('#transmittedInk')).toHaveClass(/inspected/);
    await page.locator('#closeReader').click();
   }
   await page.locator('#puzzleButton').evaluate(el=>el.click());
   await expect(page.locator('#puzzleCode')).toBeVisible();
   expect(await page.evaluate(()=>state.discoveries['0:1']&&state.discoveries['0:5'])).toBe(true);
  });
 });
}
