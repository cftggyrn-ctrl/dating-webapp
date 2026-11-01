let tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.text = "Вернуться в чат";
tg.MainButton.show();
tg.MainButton.onClick(function() {
    tg.close();
});

const VERIFIED_USERS = [892786735];
let currentUserId = null;

let profileData = {
    name: '',
    age: '',
    city: '',
    gender: '',
    preference: '',
    about: '',
    avatar: 'https://via.placeholder.com/150'
};

function loadProfile() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        currentUserId = tg.initDataUnsafe.user.id;
        
        const storageKey = 'profileData_' + currentUserId;
        const saved = localStorage.getItem(storageKey);
        
        if (saved) {
            profileData = JSON.parse(saved);
        } else {
            profileData.name = tg.initDataUnsafe.user.first_name || '';
        }
        
        updateProfileDisplay();
        
        if (VERIFIED_USERS.includes(currentUserId)) {
            addVerifiedBadge();
        }
    } else {
        const saved = localStorage.getItem('profileData');
        if (saved) {
            profileData = JSON.parse(saved);
            updateProfileDisplay();
        }
    }
}

function addVerifiedBadge() {
    const nameDisplay = document.getElementById('profile-name-display');
    if (nameDisplay && !nameDisplay.querySelector('.verified-badge')) {
        const badge = document.createElement('img');
        badge.src = 'verify.png';
        badge.className = 'verified-badge';
        badge.alt = 'Verified';
        nameDisplay.appendChild(badge);
    }
}

function updateProfileDisplay() {
    const nameDisplay = document.getElementById('profile-name-display');
    
    const oldBadge = nameDisplay.querySelector('.verified-badge');
    nameDisplay.textContent = profileData.name || 'Ваше имя';
    
    if (oldBadge) {
        nameDisplay.appendChild(oldBadge);
    }
    
    document.getElementById('profile-city-display').textContent = profileData.city || 'Город не указан';
    document.getElementById('profile-about-display').textContent = profileData.about || 'Расскажите о себе...';
    document.getElementById('profile-age-display').textContent = profileData.age || 'Не указан';
    
    const genderText = profileData.gender === 'male' ? 'Мужской' : profileData.gender === 'female' ? 'Женский' : 'Не указан';
    document.getElementById('profile-gender-display').textContent = genderText;
    
    const prefText = profileData.preference === 'all' ? 'Всех' : profileData.preference === 'male' ? 'Мужчин' : profileData.preference === 'female' ? 'Женщин' : 'Не указано';
    document.getElementById('profile-preference-display').textContent = prefText;
    
    document.getElementById('avatar-preview').src = profileData.avatar;
    document.getElementById('avatar-edit-preview').src = profileData.avatar;
}

function toggleEditMode() {
    const viewMode = document.getElementById('profile-view');
    const editMode = document.getElementById('profile-edit');
    
    if (viewMode.style.display === 'none') {
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
    } else {
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
        
        document.getElementById('edit-name').value = profileData.name;
        document.getElementById('edit-age').value = profileData.age;
        document.getElementById('edit-city').value = profileData.city;
        document.getElementById('edit-about').value = profileData.about;
        
        if (profileData.gender) {
            document.querySelector(`input[name="gender"][value="${profileData.gender}"]`).checked = true;
        }
        if (profileData.preference) {
            document.querySelector(`input[name="preference"][value="${profileData.preference}"]`).checked = true;
        }
    }
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar-edit-preview').src = e.target.result;
            profileData.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function saveProfile() {
    profileData.name = document.getElementById('edit-name').value;
    profileData.age = document.getElementById('edit-age').value;
    profileData.city = document.getElementById('edit-city').value;
    profileData.about = document.getElementById('edit-about').value;
    
    const genderRadio = document.querySelector('input[name="gender"]:checked');
    if (genderRadio) profileData.gender = genderRadio.value;
    
    const prefRadio = document.querySelector('input[name="preference"]:checked');
    if (prefRadio) profileData.preference = prefRadio.value;
    
    const storageKey = currentUserId ? 'profileData_' + currentUserId : 'profileData';
    localStorage.setItem(storageKey, JSON.stringify(profileData));
    
    updateProfileDisplay();
    toggleEditMode();
    
    if (VERIFIED_USERS.includes(currentUserId)) {
        addVerifiedBadge();
    }
    
    tg.showAlert('Профиль успешно сохранен!');
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionName + '-section').classList.add('active');
    event.target.classList.add('active');
}

loadProfile();

console.log('Web App loaded');
console.log('User data:', tg.initDataUnsafe);
