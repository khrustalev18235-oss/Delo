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
   await expect(page.locator('.archiveScene')).toBeAttached();
   await expect(page.locator('.archiveScene h3')).toContainText('Ключ без владельца');
   await page.locator('.archiveScene summary').click();
   await expect(page.locator('.archiveQuestion article')).toHaveCount(2);
   await expect(page.locator('.theoryWorkbench')).toBeVisible();
   await page.locator('.theoryWorkbench button').click();
   await expect(page.locator('.theoryResult')).toContainText('Выберите два источника');
   await page.locator('.archiveScene summary').click();
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


test('chapter three reconstruction remains optional and source-backed', async ({page}) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/complete/');
 await page.evaluate(()=>{state.chapter=2;state.seen[2]=[0,1,2,3,4,5];save();render();openDoc(1)});
 await expect(page.locator('.reconstruction')).toBeVisible();
 await page.locator('.reconstruction summary').click();
 await page.locator('.reconstructionCheck').click();
 await expect(page.locator('.reconstructionResult')).toContainText('Заполните все четыре');
 await page.locator('.reconstructionLine').nth(0).locator('select').first().selectOption('0');
 await page.locator('.reconstructionLine').nth(0).locator('select').nth(1).selectOption('1');
 await expect(page.locator('#flip')).toBeVisible();
 expect(errors).toEqual([]);
});

test('chapter four dispatch rehearsal checks evidence without completing core intercept', async ({page}) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/complete/');
 await page.evaluate(()=>{state.chapter=3;state.seen[3]=[0,1,2,3,4,5];state.puzzles[3]=false;save();render();openDoc(4)});
 await expect(page.locator('.dispatchDecision')).toBeVisible();
 await page.locator('.dispatchDecision summary').click();
 await page.locator('.dispatchDecision button').click();
 await expect(page.locator('.dispatchResult')).toContainText('Заполните все три');
 const selects=page.locator('.dispatchBody select');
 await selects.nth(0).selectOption('1');
 await selects.nth(1).selectOption('1');
 await selects.nth(2).selectOption('1');
 await page.locator('.dispatchDecision button').click();
 await expect(page.locator('.dispatchResult')).toContainText('Черновик обоснован');
 expect(await page.evaluate(()=>state.puzzles[3])).toBe(false);
 expect(errors).toEqual([]);
});
