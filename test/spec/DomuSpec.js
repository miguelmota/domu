describe('Domu', function() {

  describe('getParams', function() {

    it('should be able to get params from window url', function() {
      if (window) {
        var params = domu.getParams();
        var url = window.location + '?foo=bar';
        window.history.pushState('test', 'Title', url);
      } else {
        var params = 'http://example.com/?foo=bar';
      }

      params = domu.getParams();

      expect(params.foo === 'bar').toBeTruthy();
    });

    it('should be able to get params from user url', function() {

      var url = 'http://example.com/?foo=bar&baz=qux';
      var params = domu.getParams(url);

      expect(params.foo === 'bar').toBeTruthy();
    });

  });

  describe('isMobileDevice', function() {
    it('should check if is mobile device', function() {
      var isMobileDevice = domu.isMobileDevice();
      expect(isMobileDevice).toMatch(/(true|false)/);
    });

    it('should check if is mobile device ios', function() {
      var isMobileDevice = domu.isMobileDevice('ios');
      expect(isMobileDevice).toBeFalsy();
    });

    it('should check if is mobile device ios7', function() {
      var isMobileDevice = domu.isMobileDevice('ios7');
      expect(isMobileDevice).toBeFalsy();
    });

    it('should check if is mobile device android', function() {
      var isMobileDevice = domu.isMobileDevice('android');
      expect(isMobileDevice).toBeFalsy();
    });

  });

  describe('parseHashtag', function() {

    it('should linkify hashtag', function() {
      var string = 'loremipsum http://example.com/ #foo #bar';
      var newString = domu.parseHashtag(string, 'http://twitter.com/search?q={{tag}}');

        expect(newString).toMatch(/href/);
    });
  });

  describe('parseUsername', function() {

    it('should linkify username', function() {
      var string = 'loremipsum http://example.com/ @github @twitter';
      var newString = domu.parseUsername(string, 'http://twitter.com/{{username}}');

        expect(newString).toMatch(/href/);
    });
  });

  describe('parseUrl', function() {

    it('should linkify url', function() {
      var string = 'loremipsum http://example.com/ http://github.com/ #foo #bar';
      var newString = domu.parseUrl(string);

      expect(newString).toMatch(/(href)/);
    });
  });

  describe('setQueryStringParam', function() {
    it('should update query string param', function() {
      var uri = 'http://example.com?foo=bar&baz=qux';
      uri = domu.setQueryStringParam(uri, 'foo', 'qux');
      expect(uri).toMatch(/foo=qux/);
    });

    it("should set query string param", function() {
      var uri = 'http://example.com?blank=';
      uri = domu.setQueryStringParam(uri, 'foo', 'qux');
      expect(uri).toMatch(/foo=qux/);
    });
  });

  describe('stripTags', function() {

    it('should strip html tags', function() {
      var string = '<p><strong>foo</strong></p>';
      var newString = domu.stripTags(string);

      expect(newString).toMatch(/^foo$/);
    });
  });

});

