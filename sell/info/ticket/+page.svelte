<script>
  import { page } from '$app/stores';
  export let data;  // รับข้อมูลจาก +layout.server.js

  // ตรวจสอบข้อมูลที่ได้รับจาก backend
  // console.log('Trips Data:', data.trips);

  // ดึงค่า start_id จาก trips
  let ticketData = {};
  const firstTrip = data.trips[0].start_id; // เข้าถึง trip แรกในอาร์เรย์
  const lastTrip = data.trips[0].end_id; // เข้าถึง trip แรกในอาร์เรย์


console.log('First Trip:', firstTrip); // ตรวจสอบ trip แรก
  // Fetch ticket details from URL query parameters and database
  $: passenger = {
      from_id: $page.url.searchParams.get('from_id') || 'N/A',
      to_id: $page.url.searchParams.get('to_id') || 'N/A',
      name: $page.url.searchParams.get('name') || 'N/A',
      phone: $page.url.searchParams.get('phone') || 'N/A',
      citizenID: $page.url.searchParams.get('citizenID') || 'N/A',
      tripNumber: $page.url.searchParams.get('tripNumber') || 'N/A',
      from: $page.url.searchParams.get('from') || 'N/A',
      to: $page.url.searchParams.get('to') || 'N/A',
      travelDate: $page.url.searchParams.get('travelDate') || 'N/A',
      seatType: $page.url.searchParams.get('seatType') || 'N/A',
      amount: $page.url.searchParams.get('amount') || 'N/A',
      price: $page.url.searchParams.get('price') || 'N/A',
      coachId: $page.url.searchParams.get('coachId') || 'N/A',
      seatId: $page.url.searchParams.get('seatId') || 'N/A'
  };
  
  // Log passenger whenever it updates
  $: {
      console.log('Updated Passenger:', passenger);
  }

  async function issueTicket() {
      const url = new URL('/sell/info/ticket', window.location.origin);
      url.searchParams.append('tripNumber', passenger.tripNumber);
      url.searchParams.append('from_id', passenger.from_id);
      url.searchParams.append('to_id', passenger.to_id);
      
      // Log URL for debugging
      console.log('Request URL:', url.toString());

      const response = await fetch(url, {
          method: 'GET',  // Using GET method
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Response Data:', result);  // Log response data

          if (result.success) {
              alert('Ticket issued successfully!');
          } else {
              alert('Failed to issue ticket');
          }
      } else {
          alert('Error issuing ticket');
      }
  }
</script>



  
  <nav class="bg-[#EADBC8] shadow-xl border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-24">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="text-2xl font-bold text-[#102C57]">OURTRAINS</a>
          </div>
        </div>
  
  </nav>
<div class=" bg-white min-h-screen">
    <div class=" mx-auto py-24 rounded-md sm:px-8">
        <div class="bg-[#DAC0A3] p-2 text-white">
          <h2 class="text-lg font-bold text-[#102C57]">OURTRAIN TICKETS</h2>
        </div>
        <div class="bg-[#F8F0E5] p-4">
            <div class="grid grid-cols-2">
              <p><strong>ชื่อ-นามสกุล:</strong> {passenger.name}</p>
              <p><strong>เบอร์โทรศัพท์:</strong> {passenger.phone}</p>
            </div>

            <div class="grid grid-cols-2">
                <p><strong>เที่ยวโดยสาร:</strong> {passenger.tripNumber}</p>
                <p><strong>วันที่/เวลาเดินทาง:</strong> {passenger.travelDate}</p>
            </div>
            <hr class="border-t-1 border-black my-4"> 
            <div class="grid grid-cols-2">
                <p><strong>สถานีต้นทาง:</strong> {passenger.from}</p>
                <p><strong>ที่นั่ง:</strong> {passenger.seatId}</p>
              </div>
              <div class="grid grid-cols-2">
                <p></p> <!-- Empty space to align "ขบวนที่" with "ที่นั่ง" -->
                <p><strong>ขบวนที่:</strong> {passenger.coachId}</p>
              </div>
            <div class="grid grid-cols-2">
                <p><strong>สถานีปลายทาง:</strong> {passenger.to}</p>
                <p><strong>ชั้นโดยสาร:</strong> {passenger.seatType}</p>
            </div>
            <hr class="border-t-1 border-black my-4"> 
          
          <!-- QR Code section -->
          <div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?data={ticketData.qrCode}&size=100x100" alt="QR Code">
            <p>{ticketData.qrCode}</p>
          </div>
        </div>
        <!-- Button -->
        <div class="text-center py-8">
          <button on:click={issueTicket} class="bg-blue-800 text-white px-6 py-2 rounded-md">
            ออกตั๋ว
          </button>          
        </div>
      </div>
</div>
  
  