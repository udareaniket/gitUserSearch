#GitHub User Search and followers

In this application a user can search for a git user and get see his/her followers.

On the first screen user is asked for the search query, upon successfull retrival of data from the git server, a panel is shown which has all the git users that fit the user search creteria. Maximum of 100 users are show per page. There is provision to view next or previous set of 100 users.

On the second screen left panel, basic details of the git user are shown. Details include: Name(if set in git settings), login/username, follower count, and the user bio.

On the second screen right panel, followers of the searched git user are shown(upto 100 per page). You can click on the individual follower to see thier follower(this provides a reccursive search).

#Technology

Used AngularJs 1 as the front end framework along with material design css from https://getmdl.io which follows material ui directrions from google documented at https://material.io

Basic use of jQuery,bootstrap,javascript.

**You can see the demo here:**  [Demo](http://gitsearch-env-1.7upg4i2kjb.us-east-2.elasticbeanstalk.com/)

