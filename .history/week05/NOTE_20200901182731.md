为什么 first-letter 可以设置float 之类的, 而first-line 不行?

我的理解是 float 主要是调整  元素的位置、first-letter 他代表是一行文本中的某个字符。在letter 布局完之后,可以对其操作布局时的性能开销小。
相反 line 是调整一行的文本 位置,要对其重新布局,所消耗的性能大,所以 letter 可以设置float 

总结:
本章节主要学习了CSS 它分为 at-rules,常规的 rules

一般我们使用的是常规的rulues-> selector(选择器) 详细的结构 见 脑图