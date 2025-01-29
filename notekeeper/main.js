// ! Ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//!  Html'den gelen elemanlar
const addBox = document.querySelector(".add-box");
// querySelector bir secici ister. id de verebilir class da verebilir
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header p");
const submitBtn = document.querySelector("#submit-btn");

// ! Localstorage'dan notelari al ve eger localde nott yoksa bos dizi donder
let notes = JSON.parse(localStorage.getItem("notes")) || [];
console.log(notes);

// ! Güncelleme icin gereken degiskenler

let isUpdate = false;
let updateId = null;
// ! Fonksiyonlar ve olay izleyicileri

// AddBox a tiklaninca bir fonksiyon tetikle
addBox.addEventListener("click", () => {
  console.log(`Tiklandi`);
  // PopupboxContainer ve popupBoxa bir class ekle
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  // Arkaplandaki sayfa kaydirmasini engelle
  document.querySelector("body").style.overflow = "hidden";
});

// CloseBtn e tiklayinca popupBoxContainer ve popup a eklenen classlari cikar veya kaldir
closeBtn.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  // Arkaplandaki sayfa kaydirmasini aktif et
  document.querySelector("body").style.overflow = "auto";
});

// Menu kismini ayarlayan fonksiyon

function showMenu(elem) {
  // parentElement bir elemanin kapsam elemanina erismek icin kullanilir

  // Tiklanilan elemanin kapsamina eristikten sonra buna bir class ekledik(show classi)
  elem.parentElement.classList.add("show");

  //Tiklanilan yer menu kismi haricindeyse show classini kaldir

  document.addEventListener("click", (e) => {
    // Tiklanilan kisim i etiketi degilse ya da kapsam disindaysa show classini kaldir
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Wrapper kismindaki tiklanmalari izle

wrapper.addEventListener("click", (e) => {
  // Eger 3 noktaya tiklanildiysa
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
  // Eger sil ikonuna tiklanildiysa
  else if (e.target.classList.contains("deleteIcon")) {
    const res = confirm("bu notu silmek istedigimize emin misiniz?");
    if (res) {
      //Tiklanilan note elemanina eris
      const note = e.target.closest(".note");
      //NOtun id 'sine eris
      const noteId = note.dataset.id;
      //Notes dizisini don ve id'sini noteId'ye esit olan elemani diziden kaldir
      notes = notes.filter((note) => note.id != noteId);
      // localStorage'i güncelle

      localStorage.setItem("notes", JSON.stringify(notes));

      // renderNotes fonksiyonunu calistir

      renderNotes();
    }
  }
  // Eger güncelle ikonuna tiklanildiysa
  else if (e.target.classList.contains("updateIcon")) {
    // Tiklanilan note elemanina eris
    const note = e.target.closest(".note");
    // Note elemaninin idsine eris
    const noteId = parseInt(note.dataset.id);
    // Note dizisi icerisinde id'si bilinen elemani bul
    const foundedNote = notes.find((note) => note.id == noteId);
    console.log(foundedNote);
    // Popup icerisindeki elemanlara note degerlerini ata
    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    // Güncelleme modunu aktif et
    isUpdate = true;
    updateId = noteId;

    // Popup'i ac
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    // Popup icerisndeki gerekli alanlari update e gore duzenle
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});

// Forma bir olay dizisi ekle ve form icerisindeki verilere eris

form.addEventListener("submit", (e) => {
  //Form gönderildiginde sayfa yenilenmesini engelle
  e.preventDefault();

  //Form icerisindeki verilere eris
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];

  // Form elemanlarinin icerisindeki degerlere eris
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  //Eger title ve description degeri yoksa uyari ver varsa da islem yap
  if (!title && !description) {
    alert("Lütfen formdaki gerekli kisimlari doldurunuz !");
  }
  //Eger title ve description degeri varsa gerekli bilgileri olustur
  const date = new Date();

  let id = new Date().getTime();
  let day = date.getDate();
  let year = date.getFullYear();
  let month = months[date.getMonth()];

  // Eger güncelleme modundaysa
  if (isUpdate) {
    // Güncelleme yapilacak elemanin dizi icerisindeki indexini bul
    const noteIndex = notes.findIndex((note) => {
      return note.id == updateId;
    });
    console.log(noteIndex);
    // Dizi icerisinde yukarida bulunanan indexdeki elemanin degerlerini güncelle
    notes[noteIndex] = {
      title,
      description,
      id,
      date: `${month}, ${day}, ${year}`,
    };

    // Güncelleme modunu kapat ve popup icerisindeki elemanlari eskiye cevir
    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  } else {
    // Elde edilen verileri bir note  objesi altinda topla
    let noteInfo = {
      title,
      description,
      date: `${month}, ${day}, ${year}`,
      id,
    };
    // noteInfo objesini notes dizisine ekle
    notes.push(noteInfo);
  }

  console.log(day);
  console.log(year);
  console.log(month);

  // notes dizisini localstorage ekle
  localStorage.setItem("notes", JSON.stringify(notes));

  // Formu icerisindeki elemanlari temizle
  titleInput.value = "";
  descriptionInput.value = "";

  // Popup'i kapat
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  // Arkaplandaki sayfa kaydirmasini aktif et
  document.querySelector("body").style.overflow = "auto";

  // Not eklendikten notlari render et
  renderNotes();
});

// ! Localstoragedeki verilere ekle ekrana not kartlari render eden fonksiyon

function renderNotes() {
  //Eger localstorage'da not verisi yoksa fonksiyonu durdur
  if (!notes) return;
  // Once mevcut notlari kaldir
  // Dizideki her bir eleman icin islev tetiklemek icin forEach metodunu kullaniyoruz
  document.querySelectorAll(".note").forEach((li) => li.remove());

  // Note dizisindeki her bi eleman icin ekrana bir note karti render et

  notes.forEach((note) => {
    // data-id'yi elemanlara id vermek icin kullandik
    let liTag = `<li class="note" data-id='${note.id}'>
      
        <div class="details">
          <p class="title">${note.title}</p>
          <p class="description">
          ${note.description}
          </p>
        </div>
      
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class='updateIcon'><i class="bx bxs-edit"></i> Duzenle</li>
              <li class='deleteIcon'><i class="bx bx-trash"></i> Sil</li>
            </ul>
          </div>
        </div>
      </li>`;
    // insertAdjacentHTML metodu belirli bir ogeyi bir Html elemanina gore sirali bir sekilde eklemek icin kullanilir. Bu metod hangi konuma ekleme yapilacak(oncesine mi sonrasina mi) ve hangi elemena eklenecek bunu belirlememizi ister
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
// Sayfa yuklediginde renderNotes fonksiyonunu calistir
document.addEventListener("DOMContentLoaded", () => renderNotes());
