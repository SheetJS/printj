#!/bin/bash
# remove last digit from %a %A outputs due to implementation-dependent rounding
cat - | sed 's/.p/0p/; s/.P/0P/'
