<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
    <div class="content"<?php print $content_attributes; ?>>
        <?php
// We hide the comments and links now so that we can render them later.
        hide($content['comments']);
        hide($content['links']);
        ?>                
        <div class="team">
            <div class="team-item img-wrp"><?php print render($content['field_team_image']); ?>
                <div class="overlay"></div>
                <div class="overlay-wrp">                                        
                    <ul class="social-icons overlay-content">
                        <?php if(!empty($content['field_team_facebook_link'])):?>
                        <li><a class="facebook" href="<?php print render($content['field_team_facebook_link'][0]);?>"><i class="fa fa-facebook"></i></a></li>
                        <?php endif;?>
                        <?php if(!empty($content['field_team_twitter_link'])):?>
                        <li><a class="twitter" href="<?php print render($content['field_team_twitter_link'][0]);?>"><i class="fa fa-twitter"></i></a></li>
                        <?php endif;?>
                        <?php if(!empty($content['field_team_google_plus_link'])):?>
                        <li><a class="gplus" href="<?php print render($content['field_team_google_plus_link'][0]);?>"><i class="fa fa-google-plus"></i></a></li>
                        <?php endif;?>
                        <?php if(!empty($content['field_team_linkedin_link'])):?>
                        <li><a class="linkedin" href="<?php print render($content['field_team_linkedin_link'][0]);?>"><i class="fa fa-linkedin"></i></a></li>
                        <?php endif;?>
                    </ul>
                </div>
            </div>
            <div class="team-item team-member-info-wrp">
            <div class="team-name">
                <h5><?php print $title; ?></h5>
                <span><?php print render($content['field_team_position']); ?></span>
            </div>
            <div class="team-about">
                <p><?php print render($content['body']); ?></p>
            </div>
            <div class="team-email"><a href="#"><i class="icon-envelope"></i> <?php print render($content['field_team_email']); ?> </a></div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</div> 
