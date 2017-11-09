webpack {entry file} {destination for bundled file}

UglifyJs不能压缩es6

file-loader：解决引用路径的问题，拿background样式用url引入背景图来说，我们都知道，webpack最终会将各个模块打包成一个文件，因此我们样式中的url路径是相对入口html页面的，而不是相对于原始css文件所在的路径的。这就会导致图片引入失败。这个问题是用file-loader解决的，file-loader可以解析项目中的url引入（不仅限于css），根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件。

url-loader：如果图片较多，会发很多http请求，会降低页面性能。这个问题可以通过url-loader解决。url-loader会将引入的图片编码，生成dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此url-loader提供了一个limit参数，小于limit字节的文件会被转为DataURl，大于limit的还会使用file-loader进行copy

记得在loader使用时不需要用require引入，在plugins才需要使用require引入




url-loader和file-loader是什么关系呢？简答地说，url-loader封装了file-loader。url-loader不依赖于file-loader，即使用url-loader时，只需要安装url-loader即可，不需要安装file-loader，因为url-loader内置了file-loader。通过上面的介绍，我们可以看到，url-loader工作分两种情况：

1.文件大小小于limit参数，url-loader将会把文件转为DataURL（Base64格式）；

2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader


node-sass：因为sass-loader依赖于node-sass，所以需要先安装node-sass



开发依赖：只在开发中用来帮助你进行开发，简化代码或者生成兼容设置的以来包。你可以打开package.json来查看，devDependencies的下面的这些包为开发使用的包。这些包在生产环境中并没有用处

生产依赖：就是比如我们的js使用了jquery，jquery的程序要在浏览器端起作用，也就是说我们最终的程序也需要这个包，这就是生产依赖。这些包在dependencies中