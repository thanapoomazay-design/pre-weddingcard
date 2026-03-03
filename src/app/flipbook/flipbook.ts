import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flipbook.html',
  styleUrls: ['./flipbook.css']
})
export class FlipbookComponent implements OnInit {
  leaves = [
    { id: 1, isFlipped: false },
    { id: 2, isFlipped: false },
    { id: 3, isFlipped: false },
    { id: 4, isFlipped: false },
    { id: 5, isFlipped: false }
  ];

  currentPage = 0; 
  isPlaying = false;
  hasMusicStarted = false;

  ngOnInit() {this.startCountdown();}

  getBookClass() {
    if (this.currentPage === 0) return 'closed-front';
    if (this.currentPage === 5) return 'closed-back';
    return 'open';
  }

  handleGlobalClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // 🟢 แก้ไข: เอา .elegant-form ออก และเพิ่ม label, textarea เข้าไป 
    // เพื่อให้แตะพื้นที่ว่างในหน้า RSVP เพื่อพลิกหน้าได้ 100%
    if (target.closest('button, input, select, textarea, video, a, label')) {
      return; 
    }

    this.startMusic();
    const clickX = event.clientX;
    const screenWidth = window.innerWidth;

    // แตะซ้ายย้อนกลับ / แตะขวาไปต่อ
    if (clickX < screenWidth * 0.4) {
      this.prevPage();
    } else {
      this.nextPage();
    }
  }

  nextPage() {
    if (this.currentPage < 5) {
      this.leaves[this.currentPage].isFlipped = true;
      this.currentPage++;
      
      if (this.currentPage === 5) {
        this.launchConfetti();
      }
    } else if (this.currentPage === 5) {
      const allFlipped = this.leaves.every(leaf => leaf.isFlipped);
      if (allFlipped) {
         this.leaves.forEach(leaf => leaf.isFlipped = false);
         this.currentPage = 0;
      }}
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.leaves[this.currentPage].isFlipped = false;
    }
  }

  startMusic() {
    if (!this.hasMusicStarted) {
      const audio = document.getElementById('bgMusic') as HTMLAudioElement;
      if (audio) {
        audio.load();
        audio.play().then(() => {
          this.isPlaying = true;
          this.hasMusicStarted = true;
        }).catch(err => console.warn('Autoplay blocked', err));
      }
    }
  }
  onVideoPlay() {
  const audio = document.getElementById('bgMusic') as HTMLAudioElement;
  if (audio) audio.pause(); // สั่งหยุดเพลงเองอย่างเป็นทางการเมื่อวิดีโอเล่น
}

onVideoPause() {
  const audio = document.getElementById('bgMusic') as HTMLAudioElement;
  if (audio && this.hasMusicStarted) audio.play(); // ให้เพลงกลับมาเล่นเมื่อวิดีโอหยุดหรือจบ
}
  confirmRSVP(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // 1. สั่งพลิกหน้ากระดาษไป Thank you ก่อนเสมอ
    this.leaves.forEach(leaf => leaf.isFlipped = true);
    this.currentPage = 5;
    
    // 2. ค่อยจุดพลุ (ย้ายมาไว้หลังสุด เพื่อความชัวร์ 100%)
    setTimeout(() => {
      this.launchConfetti();
    }, 200);
  }

  
// เพิ่มตัวแปรสำหรับเก็บค่าเวลา
countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
private timerInterval: any;



startCountdown() {
  const weddingDate = new Date('2026-12-24T00:00:00').getTime(); // กำหนดวันแต่งงาน

  this.timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      clearInterval(this.timerInterval);
      return;
    }

    this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }, 1000);
}

// ปรับปรุงฟังก์ชันจุดพลุให้เรียกใช้ Global Canvas ที่อยู่หน้าสุด

  launchConfetti() {
     const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

  const fire = (particleRatio: number, opts: any) => {
    myConfetti({
      ...opts,
      particleCount: Math.floor(200 * particleRatio),
      origin: { y: 0.7 },
      colors: ['#7A906F', '#A9BA9D', '#FFFFFF', '#FFD700'],
    });
  };
    
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }

}