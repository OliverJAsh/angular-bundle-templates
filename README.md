# angular-bundle-templates

```
npm install angular-bundle-templates
```

```
angular-bundle-templates [--root root] module file …
```

E.g.

```
$ angular-bundle-templates --root client/ myApp client/foo.html client/bar.html
angular.module('myApp').run($templateCache => {
	$templateCache.put('foo.html', 'foo\n');
	$templateCache.put('bar.html', 'bar\n');
});
```
