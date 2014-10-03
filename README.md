# WORK IN PROGRESS

Quantify
========

Simple wrapper around the User Timing API so that you can simplify measurements.
If you have a set of measures that occur after your app has loaded you can have
problems if there are different marks on different pages. This library is there
to smooth out missing marks and only measure what is possible. It polyfils the
User Timing API so that older browsers don't have any issues.



quantify.measure('page_load', 'domComplete', 'key_for_page_1')
  .measure('page_load', 'domComplete', 'key_for_page_2')
  .measure('page_load', 'domComplete', 'key_for_page_3');



// sometime later use either
quantify.values()
// or
performance.getEntriesByType('measure');
// to get the values out
