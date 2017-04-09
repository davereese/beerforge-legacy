import { BeerforgePage } from './app.po';

describe('beerforge App', () => {
  let page: BeerforgePage;

  beforeEach(() => {
    page = new BeerforgePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
