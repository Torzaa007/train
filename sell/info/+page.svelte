<script>
    import { page } from '$app/stores';
    export let data
    let tripsQ = data.tripsQ
    $:  passenger = {
            from_id: $page.url.searchParams.get('start_id') || 'N/A',
            to_id: $page.url.searchParams.get('end_id') || 'N/A',
            name: `${$page.url.searchParams.get('firstName') || 'N/A'} ${$page.url.searchParams.get('lastName') || 'N/A'}`,
            phone: $page.url.searchParams.get('phoneNumber') || 'N/A',
            citizenID: $page.url.searchParams.get('citizenID') || 'N/A',
            tripNumber: $page.url.searchParams.get('tripId') || 'N/A',
            from: $page.url.searchParams.get('start') || 'N/A',
            to: $page.url.searchParams.get('end') || 'N/A',
            travelDate: $page.url.searchParams.get('travelDate') || 'N/A',
            seatType: $page.url.searchParams.get('seatType') || 'N/A',
            amount: $page.url.searchParams.get('amount') || 'N/A',
            price: $page.url.searchParams.get('totalPrice') || 'N/A',
            coachId: $page.url.searchParams.get('coachId') || 'N/A',
            seatId: $page.url.searchParams.get('seatId') || 'N/A'
        };
    // ตัวแปรสำหรับการเลือกวิธีการชำระเงิน
    let paymentMethod = '';
    $: amountToPay = passenger.price;
    // ใช้ราคารวมที่ได้จาก passenger
    let enteredAmount = '';

    function confirmPayment() {
        if (parseFloat(enteredAmount) === parseFloat(amountToPay)) {
            alert('ยืนยันการชำระเงินเรียบร้อย');
            
            // Prepare the URL with query parameters for passenger data
            const queryParams = new URLSearchParams({
                from_id: passenger.from_id,
                to_id: passenger.to_id,
                name: passenger.name,
                phone: passenger.phone,
                citizenID: passenger.citizenID,
                tripNumber: passenger.tripNumber,
                from: passenger.from,
                to: passenger.to,
                travelDate: passenger.travelDate,
                seatType: passenger.seatType,
                amount: passenger.amount,
                price: passenger.price,
                coachId: passenger.coachId,
                seatId: passenger.seatId
            }).toString();
            
            // Navigate to the ticket page with passenger data
            window.location.href = `/sell/info/ticket?${queryParams}`;
        } else {
            alert('จำนวนเงินไม่ถูกต้อง');
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
<!-- ส่วนของการออกแบบหน้าเว็บ -->
<div class="p-8 bg-white min-h-screen">
    
    <!-- ข้อมูลผู้โดยสารและรายละเอียดเที่ยวโดยสาร -->
    <div class="grid sm:grid-cols-3 gap-4 ">
        <div>
            <p><strong>ชื่อ - สกุล:</strong> {passenger.name}</p>
        </div>
        <div>
            <p><strong>เบอร์โทรศัพท์:</strong> {passenger.phone}</p>
        </div>
    </div>
    <div class="grid sm:grid-cols-3 gap-4 my-4">
        <p><strong>เที่ยวโดยสาร:</strong> {passenger.tripNumber}</p>
        <p><strong>จาก:</strong> {passenger.from} - {passenger.to}</p>
        <p><strong>วันที่/เวลา เดินทาง:</strong> {passenger.travelDate}</p>
        <p><strong>ชั้นโดยสาร:</strong> {passenger.seatType}</p>
        <p><strong>จำนวน:</strong> {passenger.amount}</p>
        <p><strong>ราคารวม:</strong> {passenger.price}</p>
    </div>

    <hr class="my-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- เลือกวิธีการชำระเงิน -->
        <div class="mb-6">
            <label  for="paymentMethod" class="block text-lg font-bold mb-2">เลือกวิธีการชำระเงิน:</label>
            <select id="paymentMethod" class="border p-2 rounded w-full bg-gray-100">
                <option>วิธีการชำระเงิน</option>
                <option>พร้อมเพย์</option>
                <option>เงินสด</option>
                <option>บัตรเครดิต</option>
            </select>
            <label for="enteredAmount" class="block text-lg font-bold mb-2 my-6">จำนวนเงินที่ชำระ or หลักฐานการชำระเงิน:</label>
            <input id="enteredAmount" type="text" class="border p-2 rounded w-full bg-gray-100" placeholder="0000" bind:value={enteredAmount} />
            <!-- ปุ่มยืนยันการชำระเงิน -->
        <button on:click={confirmPayment} class=" bg-[#102C57] text-white px-4 py-2 rounded w-full my-6">
            ยืนยันการชำระเงิน
        </button>
        </div>

        <div class="mb-6 text-5xl">
            ตรวจสอบข้อมูลของมึง
        </div>
    </div>
</div>
