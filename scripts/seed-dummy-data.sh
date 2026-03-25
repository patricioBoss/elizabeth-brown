#!/bin/bash

BASE_URL="http://localhost:8084"
YESTERDAY="2026-03-24"

echo "=== Seeding dummy investment data ==="
echo "Target date: $YESTERDAY"

# Function to get the last approvedAt date for a type
get_last_date() {
    local type=$1
    # We'll track by calling the endpoint and checking the response
    # Since we can't query directly, we'll just keep calling until we reach the target
}

# Function to call dummy invest endpoint
call_invest() {
    local response=$(curl -s "$BASE_URL/api/dummy/invest")
    local approvedAt=$(echo "$response" | grep -o '"approvedAt":"[^"]*"' | cut -d'"' -f4)
    echo "$approvedAt"
}

# Function to call dummy withdrawal endpoint
call_withdrawal() {
    local response=$(curl -s "$BASE_URL/api/dummy/withdrawal")
    local approvedAt=$(echo "$response" | grep -o '"approvedAt":"[^"]*"' | cut -d'"' -f4)
    echo "$approvedAt"
}

# Seed investment data
echo ""
echo "=== Seeding investments ==="
count=0
while true; do
    result=$(call_invest)
    if [ -n "$result" ]; then
        count=$((count + 1))
        echo "[$count] Created investment with approvedAt: $result"
        
        # Check if we've reached the target date
        if [[ "$result" > "$YESTERDAY" ]] || [[ "$result" == "$YESTERDAY" ]]; then
            echo "✓ Reached target date. Stopping investments."
            break
        fi
        
        # Safety limit
        if [ $count -ge 1000 ]; then
            echo "⚠ Reached 1000 calls. Stopping for safety."
            break
        fi
    else
        echo "Error calling invest endpoint"
        break
    fi
done
echo "Total investments created: $count"

# Seed withdrawal data
echo ""
echo "=== Seeding withdrawals ==="
count=0
while true; do
    result=$(call_withdrawal)
    if [ -n "$result" ]; then
        count=$((count + 1))
        echo "[$count] Created withdrawal with approvedAt: $result"
        
        # Check if we've reached the target date
        if [[ "$result" > "$YESTERDAY" ]] || [[ "$result" == "$YESTERDAY" ]]; then
            echo "✓ Reached target date. Stopping withdrawals."
            break
        fi
        
        # Safety limit
        if [ $count -ge 1000 ]; then
            echo "⚠ Reached 1000 calls. Stopping for safety."
            break
        fi
    else
        echo "Error calling withdrawal endpoint"
        break
    fi
done
echo "Total withdrawals created: $count"

echo ""
echo "=== Seeding complete ==="
