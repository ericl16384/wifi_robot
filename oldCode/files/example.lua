-- positional data
x = 0
y = 0
z = 0
facing = 0 -- cardinal directions clockwise

-- control data
targetX = 0
targetY = 0
targetZ = 0
doDigging = true

-- debug flags
doPrintPos = false

-- events
events = {}
stopAutoMove = false
stopWaypoints = false
function runEvents()
    for _, e in ipairs(events) do
        e()
    end
end

-- waypoints
waypoints = {}


-- util

function printPos()
    print(x, y, z, facing)
end

function refuelMin()
    if(turtle.getFuelLevel() == 0) then
        start = turtle.getSelectedSlot()
        for i = 0,15,1 do
            turtle.select((start+i)%16+1)
            if(turtle.refuel()) then
                turtle.select(start)
                return true
            end
        end
        return false
    end
end


-- rotation

function rotateLeft()
    if(turtle.turnLeft()) then
        facing = (facing-1)%4
        return true
    end
    return false
end

function rotateRight()
    if(turtle.turnRight()) then
        facing = (facing+1)%4
        return true
    end
    return false
end

function rotateTo(f)
    spin = (f-facing)%4
    if(spin == 3) then
        spin = -1
    end
    while(facing ~= f) do
        if(spin < 0) then
            rotateLeft()
        else
            rotateRight()
        end
    end
    return true
end


-- simple movement

function moveForward()
    refuelMin()
    if(doDigging and turtle.detect) then
        turtle.dig()
    end
    if(turtle.forward()) then
        if(facing == 0) then
            z = z - 1
        elseif(facing == 1) then
            x = x + 1
        elseif(facing == 2) then
            z = z + 1
        elseif(facing == 3) then
            x = x - 1
        else
            error(facing)
        end
        if(doPrintPos) then
            printPos()
        end
        return true
    end
    return false
end

function moveUp()
    refuelMin()
    if(doDigging and turtle.detectUp) then
        turtle.digUp()
    end
    if(turtle.up()) then
        y = y + 1
        if(doPrintPos) then
            printPos()
        end
        return true
    end
    return false
end

function moveDown()
    refuelMin()
    if(doDigging and turtle.detectDown) then
        turtle.digDown()
    end
    if(turtle.down()) then
        y = y - 1
        if(doPrintPos) then
            printPos()
        end
        return true
    end
    return false
end


-- automated movement

function moveAutoStepXZ()
    if(z > targetZ) then
        rotateTo(0)
        moveForward()
    elseif(x < targetX) then
        rotateTo(1)
        moveForward()
    elseif(z < targetZ) then
        rotateTo(2)
        moveForward()
    elseif(x > targetX) then
        rotateTo(3)
        moveForward()
    else
        return false
    end
    return true
end

function moveAutoStepY()
    if(y < targetY) then
        moveUp()
    elseif(y > targetY) then
        moveDown()
    else
        return false
    end
    return true
end

function moveAutoXYZ()
    while(moveAutoStepXZ()) do
        runEvents()
        if(stopAutoMove) then
            return
        end
    end
    while(moveAutoStepY()) do
        runEvents()
        if(stopAutoMove) then
            return
        end
    end
end


-- waypoints

function waypointInstruction(array)
    targetX, targetY, targetZ = table.unpack(array)
    -- kwargs ignored for now
    moveAutoXYZ()
end

function waypointInstructions(array)
    for _, i in ipairs(array) do
        waypointInstruction(i)
        if(stopWaypoints) then
            return
        end
    end
end

function calculateWaypointInstructionsFuel(array)
    cost = 0
    for k, v in ipairs(array) do
        if(k == 1) then
            x1 = x
            y1 = y
            z1 = z
        else
            x1 = array[k-1][1]
            y1 = array[k-1][2]
            z1 = array[k-1][3]
        end
        x2 = v[1]
        y2 = v[2]
        z2 = v[3]
        cost = cost + math.abs(x2-x1) + math.abs(y2-y1) + math.abs(z2-z1)
    end
    return cost
end


-- main

--depth = 16
--distance = 16
--for i=0,distance-1,1 do
--    if(i%2 == 0) then
--        table.insert(waypoints, {0, -1, -i})
--        table.insert(waypoints, {0, -depth, -i})
--    else
--        table.insert(waypoints, {0, -depth, -i})
--        table.insert(waypoints, {0, -1, -i})
--    end
--end
--table.insert(waypoints, {0, 0, 0})

--table.insert(events, function()
--    if(turtle.getItemCount(16) > 0) then
--        stopWaypoints = true
--        waypointInstruction(waypoints[#waypoints])
--    end
--end)

width = 4
height = 4
for i=0,width-1,1 do
    for j=0,height-1,1 do
        waypoints.insert({i, -1, j})
    end
end
waypoints.insert({0, 0, 0})

waypointInstructions(waypoints)

print("Instructions complete.")
