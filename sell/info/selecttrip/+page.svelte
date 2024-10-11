<script>
    import { goto } from '$app/navigation';
    import { tick } from 'svelte';

    export let tripsQ || []; // Data fetched from the backend
    export let trips; // Other trips data fetched from the backend
    let selectedTrip = null; // Selected trip
    let showSeats = false; // Control seat selection visibility
    let selectedSeatType = ''; // Selected seat type
    let amount = 0;
    let storeSuccessMessage = ''; // Confirmation messages

    // Handle trip selection
    async function handleTripSelection(trip) {
        selectedTrip = trip;
        console.log('Selected Trip:', selectedTrip); // Log the selected trip
        showSeats = false; // Reset seat selection visibility
        
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

        console.log('Updated tripsQ:', tripsQ); // Log the updated tripsQ
        showSeats = true; // Show seat selection after fetching
    }

    // Show seat options
    function handleShowSeats() {
        console.log('Showing seats, current tripsQ:', tripsQ); // Log tripsQ when seats are shown
        showSeats = true;
    }

    // Confirm seat selection and redirect to the next page
    function confirmSelection() {
        if (selectedTrip && selectedSeatType && amount > 0) {
            // Store seat details in sessionStorage
            sessionStorage.setItem('seatDetails', JSON.stringify({
                seatType: selectedSeatType,
                amount: amount
            }));

            console.log('Confirmed selection:', selectedTrip, selectedSeatType, amount); // Log selection details

            // Redirect to the next page
            goto('/sell/info/selecttrip/test1');
        } else {
            alert("Please select a trip, seat type, and number of seats.");
        }
    }
</script>

<!-- Display tripsQ -->
<p>Available tripsQ value: {JSON.stringify(tripsQ)}</p>

<!-- Trip Selection -->
<div class="border-t mb-6"></div>
<div class="overflow-auto max-h-96">
    {#each trips as trip}
    <div class="bg-gray-300 p-4 rounded mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
        <div>
            <p class="font-bold">จาก {trip.start} - {trip.end} {trip.from_datetime}</p>
            <p>เที่ยวโดยสาร {trip.trip_id} {trip.start} - {trip.end} ประเภท ชั้น {trip.class}</p>
            <p>ออกเดินทาง {trip.from_datetime} ถึง {trip.arrivalTime}</p>
        </div>
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

<!-- Show seat selection if trip is selected -->
{#if showSeats}
    <hr class="mb-6">
    <h2 class="text-xl font-bold mb-4">เลือกที่นั่ง</h2>
    <div class="grid grid-cols-3 gap-4 mb-6">
        <select class="bg-gray-300 border p-2 rounded" bind:value={selectedSeatType}>
            <option value="">ชั้นโดยสาร--ประเภทที่นั่ง</option>
            {#each tripsQ as trip}
                <option value={trip.seat_type}>{trip.seat_type} (ว่าง: {trip.available_seats})</option>
            {/each}
        </select>
        <select class="bg-gray-300 border p-2 rounded" bind:value={amount}>
            <option value="0">--จำนวนที่นั่ง--</option>
            <option value="1"> 1 </option>
            <option value="2"> 2 </option>
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
        </select>
    </div>

    <!-- Button to confirm selection and redirect -->
    <div>
        <button class="px-4 py-2 bg-green-500 text-white rounded" on:click={confirmSelection}>
            ยืนยันการเลือก
        </button>
    </div>
{/if}
