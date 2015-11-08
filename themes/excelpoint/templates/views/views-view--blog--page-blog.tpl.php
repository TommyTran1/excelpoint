<?php
$style = theme_get_setting('blog_style', 'evolve');
if ($style == 'large') {
   print views_embed_view('blog', 'page_1');
} else {
  if ($style == 'timeline') {
    print views_embed_view('blog', 'page_monthly_timeline');
  } else {
    print views_embed_view('blog', 'page');
  }
}