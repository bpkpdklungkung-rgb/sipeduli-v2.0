// ============================================
// SIPEDULI BADUNG - FRONTEND API HELPER
// ============================================

// GANTI URL INI DENGAN URL WEB APP ANDA
const API_URL = 'https://script.google.com/macros/s/AKfycbzPMcEjfQ3voTtXNOIBFmVSVCffuzpbw7QbRBe-XX7RjNfkx61kxd-hbphQLL8Lb2Mg/exec';

console.log('🔧 SIPEDULI BADUNG Helper.js loaded');
console.log('📍 API_URL:', API_URL);

// ============================================
// FUNGSI API GET
// ============================================
async function apiGet(action, params = {}) {
    console.log('\n📡 ========== API GET CALL ==========');
    console.log('Action:', action);
    console.log('Params:', params);
    
    try {
        // Bangun URL dengan parameter
        let url = API_URL + '?action=' + encodeURIComponent(action);
        
        // HANYA tambahkan parameter yang TIDAK kosong
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (value !== null && 
                value !== undefined && 
                value !== '' && 
                value !== 'undefined' &&
                value !== 'null') {
                url += '&' + key + '=' + encodeURIComponent(value);
                console.log('✅ Added param:', key, '=', value);
            } else {
                console.log('⏭️ Skipped empty param:', key);
            }
        });
        
        console.log('🔗 Final URL:', url);
        console.log('URL length:', url.length);
        
        // Fetch dengan timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal,
            redirect: 'follow'
        });
        
        clearTimeout(timeoutId);
        
        console.log('📥 Response status:', response.status);
        console.log(' Response type:', response.type);
        console.log('📥 Response ok:', response.ok);
        
        const text = await response.text();
        console.log('📄 Response text (first 500 chars):', text.substring(0, 500));
        
        try {
            const data = JSON.parse(text);
            console.log('✅ Parsed JSON successfully');
            console.log('Success:', data.success);
            console.log('Data length:', data.data?.length || 0);
            
            if (data.data && data.data.length > 0) {
                console.log('First item:', data.data[0]);
            }
            
            console.log('📡 ========== END API GET CALL ==========\n');
            return data;
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            console.error('Raw response:', text);
            console.log('📡 ========== END API GET CALL ==========\n');
            return { success: false, message: 'Invalid JSON: ' + parseError.message };
        }
        
    } catch (error) {
        console.error('❌ Fetch error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.log('📡 ========== END API GET CALL ==========\n');
        return { success: false, message: 'Network error: ' + error.message };
    }
}

// ============================================
// FUNGSI API POST
// ============================================
async function apiPost(action, data = {}) {
    console.log('\n📤 ========== API POST CALL ==========');
    console.log('Action:', action);
    console.log('Data:', data);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: action, ...data }),
            redirect: 'follow'
        });
        
        console.log('📥 Response status:', response.status);
        
        const text = await response.text();
        console.log('📄 Response text:', text.substring(0, 300));
        
        const result = JSON.parse(text);
        console.log('✅ Response:', result);
        console.log(' ========== END API POST CALL ==========\n');
        
        return result;
    } catch (error) {
        console.error('❌ POST error:', error);
        console.log('📤 ========== END API POST CALL ==========\n');
        return { success: false, message: error.message };
    }
}

// ============================================
// FUNGSI-FUNGSI API
// ============================================

async function login(username, password, role) { 
    console.log('🔐 Calling login for:', username);
    return await apiGet('login', { username, password, role }); 
}

async function getDisabilitas(filters = {}) { 
    console.log('👥 Calling getDisabilitas with filters:', filters);
    return await apiGet('getDisabilitas', filters); 
}

async function saveDisabilitas(data) { 
    console.log('💾 Calling saveDisabilitas');
    return await apiPost('saveDisabilitas', data); 
}

async function updateDisabilitas(data) { 
    console.log('🔄 Calling updateDisabilitas');
    return await apiPost('updateDisabilitas', data); 
}

async function deleteDisabilitas(id) { 
    console.log('🗑️ Calling deleteDisabilitas:', id);
    return await apiPost('deleteDisabilitas', { id }); 
}

async function getAsesmen(filters = {}) { 
    console.log(' Calling getAsesmen with filters:', filters);
    return await apiGet('getAsesmen', filters); 
}

async function saveAsesmen(data) { 
    console.log('💾 Calling saveAsesmen');
    return await apiPost('saveAsesmen', data); 
}

async function getBantuan(filters = {}) { 
    console.log('🎁 Calling getBantuan with filters:', filters);
    return await apiGet('getBantuan', filters); 
}

async function saveBantuan(data) { 
    console.log('💾 Calling saveBantuan');
    return await apiPost('saveBantuan', data); 
}

async function updateStatusBantuan(data) { 
    console.log('🔄 Calling updateStatusBantuan');
    return await apiPost('updateStatusBantuan', data); 
}

async function getStats() { 
    console.log('📊 Calling getStats');
    return await apiGet('getStats'); 
}

async function getPrioritas() { 
    console.log(' Calling getPrioritas');
    return await apiGet('getPrioritas'); 
}

async function getAnalitik() { 
    console.log(' Calling getAnalitik');
    return await apiGet('getAnalitik'); 
}

async function getKecamatan() { 
    console.log('️ Calling getKecamatan');
    return await apiGet('getKecamatan'); 
}

async function getDesa(filters = {}) { 
    console.log('🏘️ Calling getDesa with filters:', filters);
    return await apiGet('getDesa', filters); 
}

// ============================================
// FUNGSI UI - NOTIFIKASI
// ============================================
function showNotif(pesan, tipe = 'success') {
    const notif = document.createElement('div');
    notif.className = `alert alert-${tipe} alert-dismissible fade show position-fixed`;
    notif.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    notif.innerHTML = `${pesan}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

// ============================================
// FUNGSI UI - LOADING
// ============================================
function showLoading(pesan = 'Memproses...') {
    let loader = document.getElementById('globalLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;';
        loader.innerHTML = `<div class="bg-white rounded-3 p-4 text-center shadow-lg">
            <div class="spinner-border text-success mb-2" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mb-0 fw-semibold">${pesan}</p>
        </div>`;
        document.body.appendChild(loader);
    } else {
        loader.style.display = 'flex';
    }
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
}