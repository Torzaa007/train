<script>
    export let data;
    import { goto } from '$app/navigation';
    import { tick, onMount } from 'svelte';
    import { page } from '$app/stores';

    let tripsQ = data.tripsQ;
    let success = $page.data.success;
    let trips = data.trips;
    let stations = data.stations;  // For dropdown
    let selectedTrip = null; // Selected trip
    let selectedSeatType = ''; // Selected seat type
    let amount = '';
    let totalPrice = 0;
    let coachId = ''; // Selected coach ID
    let selectedSeatId = ''; // Selected seat ID
    let firstName = '';
    let lastName = '';
    let citizenID = '';
    let phoneNumber = '';
    let fromStation = '';
    let toStation = '';
    let travelDate = '';
    let showSeats = false; // Control whether the seat selection is shown

    let storeSuccessMessage = ''; // To store confirmation messages

    // Retrieve stored data from sessionStorage on component mount
    onMount(() => {
        const storedTrip = sessionStorage.getItem('selectedTrip');
        const storedPassenger = sessionStorage.getItem('passengerDetails');
        const storedTripsQ = sessionStorage.getItem('tripsQ');

        // If data exists in sessionStorage, parse and assign it to variables
        if (storedTrip) {
            const tripData = JSON.parse(storedTrip);
            selectedTrip = tripData;
            fromStation = tripData.start;
            toStation = tripData.end;
            travelDate = tripData.from_datetime;
        }

        if (storedPassenger) {
            const passengerData = JSON.parse(storedPassenger);
            firstName = passengerData.firstName;
            lastName = passengerData.lastName;
            citizenID = passengerData.citizenID;
            phoneNumber = passengerData.phoneNumber;
            selectedSeatType = passengerData.seatType;
            amount = passengerData.amount;
            totalPrice = passengerData.totalPrice;
        }

        if (storedTripsQ) {
            tripsQ = JSON.parse(storedTripsQ);
        }
    });

    // Handle trip selection and store the selected trip and tripsQ in sessionStorage
    async function handleTripSelection(trip) {
        selectedTrip = trip;
        showSeats = false; // Reset seat selection visibility
        console.log('Selected Trip:', selectedTrip.trip_id);
        
        // Store selected trip data in sessionStorage
        sessionStorage.setItem('selectedTrip', JSON.stringify({
            tripId: selectedTrip.trip_id,
            start: selectedTrip.start,
            end: selectedTrip.end,
            price: selectedTrip.price,
            from_datetime: selectedTrip.from_datetime,
            arrivalTime: selectedTrip.arrivalTime
        }));

        await tick(); // Ensure UI is updated
        try {
            const response = await fetch(`/sell/info?selectedTripId=${selectedTrip.trip_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            if (result.success) {
                tripsQ = result.tripsQ; // Update tripsQ from backend
                // Store tripsQ data in sessionStorage
                sessionStorage.setItem('tripsQ', JSON.stringify(tripsQ));

                // Check if tripsQ was stored successfully
                const checkTripsQData = sessionStorage.getItem('tripsQ');
                if (checkTripsQData) {
                    storeSuccessMessage = "TripsQ data stored successfully.";
                    console.log(storeSuccessMessage);
                } else {
                    storeSuccessMessage = "Failed to store TripsQ data.";
                    console.error(storeSuccessMessage);
                }

                showSeats = true; // Show seat selection after fetching
                console.log('Updated tripsQ:', tripsQ);
            } else {
                console.error('Failed to fetch trip details:', result.error);
            }
        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    }

    // Confirm selection and store the passenger details in sessionStorage
    function confirmSelection() {
        if (selectedTrip && selectedSeatType && firstName && lastName && citizenID && phoneNumber) {
            totalPrice = (selectedTrip.price || 0) * parseInt(amount);
            coachId = selectedTrip.coach_id;
            selectedSeatId = selectedTrip.seat_id;

            // Store selected passenger and seat details in sessionStorage
            sessionStorage.setItem('passengerDetails', JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                citizenID: citizenID,
                phoneNumber: phoneNumber,
                seatType: selectedSeatType,
                amount: amount,
                totalPrice: totalPrice,
                seatId: selectedSeatId
            }));

            const queryParams = new URLSearchParams({
                tripId: selectedTrip.trip_id || '',
                firstName: firstName,
                lastName: lastName,
                citizenID: citizenID,
                phoneNumber: phoneNumber,
                seatType: selectedSeatType,
                totalPrice: totalPrice.toString() || ''
            }).toString();

            goto(`/sell/info?${queryParams}`);
        } else {
            alert("Please fill in all required fields.");
        }
    }

    // Handle displaying the seats after a trip is selected
    async function handleShowSeats() {
        // Fetch updated trip details from backend
        showSeats = true;
    }
</script>

<!-- Rest of your HTML content -->

<nav class="bg-[#EADBC8] shadow-xl border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-24">
            <div class="flex">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="text-2xl font-bold text-[#102C57]">OURTRAINS</a>
                </div>
            </div>
        </div>
    </div>
</nav>

<div class="p-8 bg-white min-h-screen">
    <h1 class="text-3xl text-[#102C57] underline font-bold mb-6 text-center">ออกตั๋วโดยสาร</h1>

    <!-- Display Success Message -->
    {#if storeSuccessMessage}
        <div class="p-4 mb-4 text-green-800 bg-green-200 rounded">
            {storeSuccessMessage}
        </div>
    {/if}

    <!-- ฟอร์มสำหรับเลือกข้อมูลการเดินทาง -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <!-- Dropdown สำหรับเลือกเส้นทางโดยสาร -->
        <select class="border p-2 rounded bg-gray-300" bind:value={fromStation}>
            <option value="">--เส้นทางโดยสาร--</option>
            <option value="st_ne">สายตะวันออกเฉียงเหนือ</option>
            <option value="st_nl">สายใต้</option>
        </select>
        <select class="border p-2 rounded bg-gray-300" bind:value={fromStation}>
            <option value="">--ต้นทาง--</option>
            {#each stations as station}
            <option value={station.station_id}>{station.station_name}</option>
            {/each}
        </select>
        <!-- Dropdown สำหรับเลือกปลายทาง -->
        <select class="border p-2 rounded bg-gray-300" bind:value={toStation}>
            <option value="">--ปลายทาง--</option>
            {#each stations as station}
            <option value={station.station_id}>{station.station_name}</option>
            {/each}
        </select>
        <input type="date" class="bg-gray-300 border p-2 rounded" bind:value={travelDate} placeholder="--วันที่เดินทาง--">
    </div>

    <!-- ปุ่มแสดงเที่ยวโดยสาร -->
    <button class="bg-[#102C57] text-white px-4 py-2 rounded mb-6">แสดงเที่ยวโดยสาร</button>

    <!-- รายละเอียดเที่ยวโดยสาร -->
    <div class="border-t mb-6"></div>
    <div class="overflow-auto max-h-96">
        {#each trips as trip}
        <div class="bg-gray-300 p-4 rounded mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
            <div>
                <p class="font-bold">จาก {trip.start} - {trip.end} {trip.from_datetime}</p>
                <p>เที่ยวโดยสาร {trip.trip_id} {trip.start} - {trip.end} ประเภท ชั้น {trip.class}</p>
                <p>ออกเดินทาง {trip.from_datetime} ถึง {trip.arrivalTime}</p>
            </div>
            <!-- Flex container for buttons to position them next to each other -->
            <div class="flex space-x-2 mt-2 sm:mt-0">
                <button 
                    class={`px-8 py-2 rounded ${selectedTrip === trip ? 'bg-green-500' : 'bg-[#102C57]'} text-white`} 
                    on:click={() => handleTripSelection(trip)}>
                    เลือก
                </button>
                {#if selectedTrip === trip}
                    <button 
                        class={`px-8 py-2 rounded ${showSeats ? 'bg-green-500' : 'bg-[#102C57]'} text-white`} 
                        on:click={handleShowSeats}>
                        แสดงที่นั่ง
                    </button>
                {/if}
            </div>
        </div>
    {/each}
    </div>

    <!-- ส่วนของการเลือกที่นั่ง -->
    {#if showSeats}
    <hr class="mb-6">
    <h2 class="text-xl font-bold mb-4">เลือกที่นั่ง</h2>
    <div class="grid grid-cols-3 gap-4 mb-6">
        <select class="bg-gray-300 border p-2 rounded" bind:value={selectedSeatType} on:change={() => console.log('Selected Seat Type:', selectedSeatType)}>
            <option value="">ชั้นโดยสาร--ประเภทที่นั่ง</option>
            {#each tripsQ as trip}
                <option value={trip.seat_type}>{trip.seat_type} (ว่าง: {trip['count(seat_id)']})</option>
            {/each}
        </select>
        <select class="bg-gray-300 border p-2 rounded" bind:value={amount}>
            <option value="">--จำนวนที่นั่ง--</option>
            <option value="1"> 1 </option>
            <option value="2"> 2 </option>
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
        </select>
    </div>
    <!-- รายละเอียดของที่นั่ง -->
    <div class="grid grid-cols-4 gap-4 mb-4">
        {#each tripsQ as seatType}
        <div>
            <p>{seatType.seat_type} ว่าง: {seatType['count(seat_id)']}</p>
        </div>
        {/each}
    </div>
    {/if}

    <!-- ฟอร์มข้อมูลผู้โดยสาร -->
    {#if selectedTrip && selectedSeatType}
    <hr class="mb-6">
    <h2 class="text-xl font-bold mb-4">ข้อมูลผู้โดยสาร</h2>
    <div class="grid grid-cols-4 gap-4 mb-4">
        <input type="text" class="border p-2 rounded" placeholder="ชื่อ" bind:value={firstName} required>
        <input type="text" class="border p-2 rounded" placeholder="นามสกุล" bind:value={lastName}>
        <input type="text" class="border p-2 rounded" placeholder="รหัสประจำตัวประชาชน" bind:value={citizenID}>
        <input type="text" class="border p-2 rounded" placeholder="เบอร์โทรศัพท์" bind:value={phoneNumber}>
    </div>
    <div class="mt-4 flex items-center justify-center bg-white">
        <button on:click={confirmSelection} class="bg-[#102C57] text-white px-4 py-2 rounded-md">
            ยืนยัน
        </button>
    </div>
    {/if}
</div>
