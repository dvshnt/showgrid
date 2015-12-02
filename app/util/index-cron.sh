#!/bin/bash

echo "REBUILDING SEARCH INDEX"

echo "y" | python /home/ubuntu/showgrid/app/manage.py rebuild_index

echo "COMPLETED REBUILDIN INDEX"

sudo chmod -R g+rw /home/ubuntu/showgrid/app/server/whoosh_index/
sudo chown www-data:www-data /home/ubuntu/showgrid/app/server/whoosh_index/
