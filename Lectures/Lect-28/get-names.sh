#!/bin/bash
 
sed -E 's/^.*DisplayName="//' <$1 | sed -E 's/".*$//' >$2
