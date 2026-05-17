document.addEventListener('DOMContentLoaded', () => {
    // App State for prototype
    let currentUser = {
        name: '',
        mobile: '',
        pincode: '',
        complaintsRaised: 0,
        complaintsSolved: 0
    };


    // 2. UI Interactions - Tabs
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const secLogin = document.getElementById('sec-login');
    const secRegister = document.getElementById('sec-register');

    const switchTab = (activeTab, inactiveTab, showSec, hideSec) => {
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');

        hideSec.classList.add('hidden');
        setTimeout(() => {
            hideSec.style.display = 'none';
            showSec.style.display = 'block';
            setTimeout(() => showSec.classList.remove('hidden'), 50);
        }, 300); // match CSS transition duration
    };

    tabLogin.addEventListener('click', () => switchTab(tabLogin, tabRegister, secLogin, secRegister));
    tabRegister.addEventListener('click', () => switchTab(tabRegister, tabLogin, secRegister, secLogin));

    // 3. Login Flow (OTP Simulation)
    let otpRequested = false;
    const loginForm = document.getElementById('form-login');
    const btnLoginAction = document.getElementById('btn-login-action');
    const otpGroup = document.getElementById('otp-group');
    const loginMobile = document.getElementById('login-mobile');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Add a zoom effect to the background when action occurs
        document.getElementById('space-bg').style.transform = "scale(1.1)";
        setTimeout(() => document.getElementById('space-bg').style.transform = "", 1500);

        if (!otpRequested) {
            // Validate mobile
            if (loginMobile.value.length === 10) {
                btnLoginAction.innerHTML = "Sending OTP...";
                
                // Simulate SMS delay
                setTimeout(() => {
                    otpGroup.style.display = 'block';
                    setTimeout(() => otpGroup.classList.remove('hidden'), 50);
                    btnLoginAction.innerHTML = "Login";
                    document.getElementById('login-otp').focus();
                    otpRequested = true;
                }, 1000);
            } else {
                alert("Please enter a valid 10-digit mobile number.");
            }
        } else {
            // Verify OTP logic
            const otpCode = document.getElementById('login-otp').value;
            if (otpCode.length >= 4) { // Accept any random code 4+ digits
                btnLoginAction.innerHTML = "Verifying...";
                setTimeout(() => {
                    alert("Login Successful! Welcome to CivicFix India.");
                    
                    // Capture User Info
                    currentUser.name = document.getElementById('login-name').value || 'User';
                    currentUser.mobile = document.getElementById('login-mobile').value || 'N/A';
                    currentUser.pincode = document.getElementById('login-pincode').value || 'N/A';
                    
                    // Populate Dashboard & Profile Data
                    document.getElementById('nav-profile-name').textContent = currentUser.name.split(' ')[0]; // First name
                    document.getElementById('modal-profile-name').textContent = currentUser.name;
                    document.getElementById('modal-profile-mobile').textContent = currentUser.mobile;
                    document.getElementById('modal-profile-pincode').textContent = currentUser.pincode;
                    
                    // Fetch real-time location & constituency based on Pincode
                    if (currentUser.pincode.length === 6) {
                        fetch(`https://api.postalpincode.in/pincode/${currentUser.pincode}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data && data[0] && data[0].Status === "Success") {
                                    const postOffice = data[0].PostOffice[0];
                                    const location = postOffice.Name;
                                    const district = postOffice.District;
                                    const state = postOffice.State;
                                    const city = postOffice.Block || postOffice.Division || district;
                                    
                                    document.getElementById('modal-profile-location').textContent = location;
                                    document.getElementById('modal-profile-city').textContent = city;
                                    document.getElementById('modal-profile-constituency').textContent = district;
                                    document.getElementById('modal-profile-state').textContent = state;
                                    
                                    // Update Nav profile name to include local area
                                    document.getElementById('nav-profile-name').textContent = `${currentUser.name.split(' ')[0]} (${city})`;
                                } else {
                                    document.getElementById('modal-profile-location').textContent = "Not Found";
                                    document.getElementById('modal-profile-city').textContent = "Not Found";
                                    document.getElementById('modal-profile-constituency').textContent = "Not Found";
                                    document.getElementById('modal-profile-state').textContent = "Not Found";
                                }
                            })
                            .catch(err => {
                                document.getElementById('modal-profile-location').textContent = "Unknown";
                                document.getElementById('modal-profile-city').textContent = "Unknown";
                                document.getElementById('modal-profile-constituency').textContent = "Unknown";
                                document.getElementById('modal-profile-state').textContent = "Unknown";
                                console.error("Pincode API Error:", err);
                            });
                    }
                    
                    // Initial Stats (Starting fresh for the prototype)
                    document.getElementById('dash-stat-registered').textContent = currentUser.complaintsRaised;
                    document.getElementById('dash-stat-solved').textContent = currentUser.complaintsSolved;
                    document.getElementById('modal-profile-raised').textContent = currentUser.complaintsRaised;
                    document.getElementById('modal-profile-solved').textContent = currentUser.complaintsSolved;

                    document.getElementById('main-header').style.display = 'none';
                    document.getElementById('auth-panel').style.display = 'none';
                    
                    const dashboard = document.getElementById('dashboard-container');
                    dashboard.style.display = 'flex';
                    setTimeout(() => dashboard.classList.remove('hidden'), 50);
                }, 1000);
            } else {
                alert("Please enter valid OTP.");
            }
        }
    });

    // 4. Registration Flow
    const registerForm = document.getElementById('form-register');
    const btnRegisterAction = document.getElementById('btn-register-action');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        btnRegisterAction.innerHTML = "Registering...";

        // Add a zoom effect to the background when action occurs
        document.getElementById('space-bg').style.transform = "scale(1.1)";
        setTimeout(() => document.getElementById('space-bg').style.transform = "", 1500);

        setTimeout(() => {
            alert("Registration successful! You can now login.");
            btnRegisterAction.innerHTML = "Register";
            switchTab(tabLogin, tabRegister, secLogin, secRegister);
            loginMobile.value = document.getElementById('reg-mobile').value;
        }, 1500);
    });

    // 5. Complaint Submission
    const complaintForm = document.getElementById('form-complaint');
    if (complaintForm) {
        complaintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = complaintForm.querySelector('.action-btn');
            btn.innerHTML = "Submitting...";
            
            // Add a zoom effect to the background when action occurs
            document.getElementById('space-bg').style.transform = "scale(1.1)";
            setTimeout(() => document.getElementById('space-bg').style.transform = "", 1500);

            setTimeout(() => {
                // Show success message
                const successMsg = document.getElementById('complaint-success-msg');
                if(successMsg) {
                    successMsg.style.display = 'flex';
                    setTimeout(() => successMsg.classList.remove('hidden'), 50);
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        successMsg.classList.add('hidden');
                        setTimeout(() => successMsg.style.display = 'none', 300);
                    }, 3000);
                }

                complaintForm.reset();
                if(photoPreview) {
                    capturedImage.src = '';
                    photoPreview.style.display = 'none';
                    if(uploadInput) uploadInput.value = '';
                }
                btn.innerHTML = "Submit Complaint";
                
                // Update stats
                currentUser.complaintsRaised += 1;
                document.getElementById('dash-stat-registered').textContent = currentUser.complaintsRaised;
                document.getElementById('modal-profile-raised').textContent = currentUser.complaintsRaised;

                // Update national stats dynamically
                const natReg = document.getElementById('dash-stat-nat-registered');
                let currentNat = parseInt(natReg.textContent.replace(/,/g, ''));
                currentNat += 1;
                natReg.textContent = currentNat.toLocaleString('en-IN');
            }, 1000);
        });
    }

    // 6. Profile Modal Logic
    const btnProfile = document.getElementById('btn-profile');
    const profileModal = document.getElementById('profile-modal');
    const btnCloseProfile = document.getElementById('btn-close-profile');

    if (btnProfile && profileModal && btnCloseProfile) {
        btnProfile.addEventListener('click', () => {
            profileModal.style.display = 'flex';
            setTimeout(() => profileModal.classList.remove('hidden'), 50);
        });

        btnCloseProfile.addEventListener('click', () => {
            profileModal.classList.add('hidden');
            setTimeout(() => profileModal.style.display = 'none', 300);
        });
    }

    // 7. WebRTC Camera Logic
    const btnOpenCamera = document.getElementById('btn-open-camera');
    const cameraModal = document.getElementById('camera-modal');
    const btnCloseCamera = document.getElementById('btn-close-camera');
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('camera-canvas');
    const btnCapturePhoto = document.getElementById('btn-capture-photo');
    const photoPreview = document.getElementById('photo-preview');
    const capturedImage = document.getElementById('captured-image');
    const btnRetake = document.getElementById('btn-retake');
    const uploadInput = document.getElementById('comp-photo-upload');

    let stream = null;

    if (btnOpenCamera && cameraModal) {
        btnOpenCamera.addEventListener('click', async () => {
            cameraModal.style.display = 'flex';
            setTimeout(() => cameraModal.classList.remove('hidden'), 50);
            
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                video.srcObject = stream;
            } catch (err) {
                alert("Camera access denied or unavailable.");
                console.error(err);
            }
        });

        const stopCamera = () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
            }
            cameraModal.classList.add('hidden');
            setTimeout(() => cameraModal.style.display = 'none', 300);
        };

        btnCloseCamera.addEventListener('click', stopCamera);

        btnCapturePhoto.addEventListener('click', () => {
            if (stream) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                capturedImage.src = dataUrl;
                photoPreview.style.display = 'block';
                setTimeout(() => photoPreview.classList.remove('hidden'), 50);
                stopCamera();
            }
        });

        btnRetake.addEventListener('click', () => {
            capturedImage.src = '';
            photoPreview.style.display = 'none';
            uploadInput.value = ''; // Reset upload input too
        });

        uploadInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    capturedImage.src = e.target.result;
                    photoPreview.style.display = 'block';
                    setTimeout(() => photoPreview.classList.remove('hidden'), 50);
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // 8. Tracking Logic
    const btnTrack = document.getElementById('btn-track');
    const trackingModal = document.getElementById('tracking-modal');
    const btnCloseTracking = document.getElementById('btn-close-tracking');
    const noComplaintMsg = document.getElementById('no-complaint-msg');
    const complaintTimeline = document.getElementById('complaint-timeline');

    if (btnTrack && trackingModal && btnCloseTracking) {
        btnTrack.addEventListener('click', () => {
            if (currentUser.complaintsRaised > 0) {
                noComplaintMsg.style.display = 'none';
                complaintTimeline.style.display = 'flex';
                setTimeout(() => complaintTimeline.classList.remove('hidden'), 50);
            } else {
                noComplaintMsg.style.display = 'block';
                complaintTimeline.style.display = 'none';
            }

            trackingModal.style.display = 'flex';
            setTimeout(() => trackingModal.classList.remove('hidden'), 50);
        });

        btnCloseTracking.addEventListener('click', () => {
            trackingModal.classList.add('hidden');
            setTimeout(() => trackingModal.style.display = 'none', 300);
        });
    }

    // 9. Quick Complaint Logic
    const quickOptions = document.querySelectorAll('.quick-option-btn');
    const quickRaiseModal = document.getElementById('quick-raise-modal');
    const btnCloseQuickModal = document.getElementById('btn-close-quick-modal');
    const quickModalTitle = document.getElementById('quick-modal-title');
    const quickCameraInput = document.getElementById('quick-camera-input');
    const quickFileInput = document.getElementById('quick-file-input');
    const quickSuccessMsg = document.getElementById('quick-success-msg');
    const quickDesc = document.getElementById('quick-desc');
    const quickStep1 = document.getElementById('quick-step-1');
    const quickStep2 = document.getElementById('quick-step-2');
    const btnQuickNext = document.getElementById('btn-quick-next');
    let selectedQuickIssue = "";

    if (quickOptions.length > 0) {
        quickOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedQuickIssue = btn.getAttribute('data-issue');
                quickModalTitle.textContent = selectedQuickIssue;
                quickDesc.value = ""; // Clear previous description
                
                // Show Step 1, Hide Step 2
                quickStep1.style.display = 'block';
                quickStep2.style.display = 'none';
                
                quickRaiseModal.style.display = 'flex';
                setTimeout(() => quickRaiseModal.classList.remove('hidden'), 50);
            });
        });

        if (btnCloseQuickModal) {
            btnCloseQuickModal.addEventListener('click', () => {
                quickRaiseModal.classList.add('hidden');
                setTimeout(() => quickRaiseModal.style.display = 'none', 300);
            });
        }
        
        if (btnQuickNext) {
            btnQuickNext.addEventListener('click', () => {
                quickStep1.style.display = 'none';
                quickStep2.style.display = 'block';
            });
        }

        const handleQuickRaiseSubmit = (e) => {
            if (e.target.files && e.target.files[0]) {
                // Close modal
                quickRaiseModal.classList.add('hidden');
                setTimeout(() => quickRaiseModal.style.display = 'none', 300);
                
                document.getElementById('space-bg').style.transform = "scale(1.1)";
                setTimeout(() => document.getElementById('space-bg').style.transform = "", 1500);

                const processRegistration = (locationText) => {
                    setTimeout(() => {
                        // Show success message
                        if (quickSuccessMsg) {
                            quickSuccessMsg.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ${locationText}`;
                            quickSuccessMsg.style.display = 'flex';
                            setTimeout(() => quickSuccessMsg.classList.remove('hidden'), 50);
                            
                            setTimeout(() => {
                                quickSuccessMsg.classList.add('hidden');
                                setTimeout(() => quickSuccessMsg.style.display = 'none', 300);
                            }, 4000);
                        }

                        // Update stats
                        currentUser.complaintsRaised += 1;
                        document.getElementById('dash-stat-registered').textContent = currentUser.complaintsRaised;
                        document.getElementById('modal-profile-raised').textContent = currentUser.complaintsRaised;

                        const natReg = document.getElementById('dash-stat-nat-registered');
                        let currentNat = parseInt(natReg.textContent.replace(/,/g, ''));
                        currentNat += 1;
                        natReg.textContent = currentNat.toLocaleString('en-IN');
                        
                        e.target.value = ""; // Reset file input
                    }, 500);
                };

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude.toFixed(4);
                            const lon = position.coords.longitude.toFixed(4);
                            processRegistration(`REGISTERED (LOC: ${lat}, ${lon})`);
                        },
                        (error) => {
                            processRegistration(`REGISTERED (Location Denied)`);
                        },
                        { timeout: 5000 }
                    );
                } else {
                    processRegistration(`REGISTERED SUCCESSFULLY`);
                }
            }
        };

        if (quickCameraInput) quickCameraInput.addEventListener('change', handleQuickRaiseSubmit);
        if (quickFileInput) quickFileInput.addEventListener('change', handleQuickRaiseSubmit);
    }

});
